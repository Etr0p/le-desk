import type { GlossaireEntree } from '../engine/types';

const M4 = '04-taux-obligations';

export const glossaire: GlossaireEntree[] = [
  {
    terme: '2s10s',
    definition:
      'Spread de courbe le plus suivi : taux 10 ans moins taux 2 ans, exprimé en points de base. Négatif, il signale une courbe inversée — l\'indicateur avancé de récession le plus célèbre de la macroéconomie.',
    moduleId: M4,
  },
  {
    terme: 'adjudication',
    en: 'auction',
    definition:
      'Mode d\'émission des titres d\'État français : l\'AFT sert les ordres des SVT du prix le plus élevé au plus bas, et chaque ordre servi paie le prix qu\'il a demandé (enchère à prix multiples). BTF chaque semaine, OAT chaque mois.',
    moduleId: M4,
  },
  {
    terme: 'base Exact/360',
    en: 'Act/360 day count',
    definition:
      'Convention de décompte du marché monétaire euro : jours calendaires réels au numérateur, année forfaitaire de 360 jours au dénominateur. À taux affiché égal, elle verse environ 1,4 % d\'intérêts de plus en relatif qu\'une base 365.',
    moduleId: M4,
  },
  {
    terme: 'bootstrapping',
    definition:
      'Méthode d\'extraction de proche en proche des taux zéro-coupon à partir des prix d\'obligations couponnées : z₁ donne z₂, qui donne z₃, etc. C\'est la courbe ainsi reconstruite — et non la courbe des YTM — qu\'utilisent les pricers.',
    moduleId: M4,
  },
  {
    terme: 'BTF',
    definition:
      'Bon du Trésor à taux fixe et à intérêts précomptés : titre de dette de l\'État français à moins d\'un an, fonctionnant en zéro-coupon, émis chaque semaine par adjudication.',
    moduleId: M4,
  },
  {
    terme: 'Bund',
    definition:
      'Obligation de l\'État fédéral allemand, considérée comme la référence « sans risque » de la zone euro : les autres dettes souveraines en euro se mesurent en spread au-dessus de lui.',
    moduleId: M4,
  },
  {
    terme: 'convexité',
    en: 'convexity',
    definition:
      'Courbure de la relation prix-taux. Le terme correctif en ½C(Δy)² est positif dans les deux sens : la convexité amortit les pertes en cas de hausse des taux et amplifie les gains en cas de baisse — à duration égale, c\'est une qualité qui se paie.',
    moduleId: M4,
  },
  {
    terme: 'coupon',
    definition:
      'Intérêt périodique versé par l\'émetteur d\'une obligation, exprimé en pourcentage du nominal. Sur un titre à taux fixe, il est gravé dans le contrat et ne s\'ajuste jamais aux conditions de marché.',
    moduleId: M4,
  },
  {
    terme: 'coupon couru',
    en: 'accrued interest',
    definition:
      'Fraction du coupon accumulée depuis le dernier détachement, que l\'acheteur règle au vendeur en plus du prix coté. Prix sale = prix propre + coupon couru.',
    moduleId: M4,
  },
  {
    terme: 'courbe des taux',
    en: 'yield curve',
    definition:
      'Ensemble des rendements actuariels d\'un même émetteur classés par maturité, à un instant donné. La courbe souveraine de chaque devise sert d\'étalon au pricing de tous les autres actifs.',
    moduleId: M4,
  },
  {
    terme: 'démembrement',
    en: 'stripping',
    definition:
      'Séparation des coupons et du principal d\'une obligation en autant de zéro-coupons négociables indépendamment (OAT démembrées, ou strips). Permet d\'adosser un engagement à date fixe avec une duration exactement égale à la maturité.',
    moduleId: M4,
  },
  {
    terme: 'duration de Macaulay',
    en: 'Macaulay duration',
    definition:
      'Moyenne des dates des flux d\'une obligation, chaque date étant pondérée par le poids du flux actualisé dans le prix : le barycentre temporel, exprimé en années. Celle d\'un zéro-coupon égale exactement sa maturité.',
    moduleId: M4,
  },
  {
    terme: 'duration modifiée',
    en: 'modified duration',
    definition:
      'Facteur de sensibilité du prix au taux : D_mod = D_Mac/(1+y), sans unité. Une duration modifiée de 6 signifie environ 6 % de perte de prix pour une hausse de 1 point du taux.',
    moduleId: M4,
  },
  {
    terme: 'DV01',
    en: 'dollar value of a basis point',
    definition:
      'Variation en monnaie d\'une position pour un mouvement de 1 point de base des taux : DV01 ≈ duration modifiée × valeur de marché × 0,0001. C\'est l\'unité de risque que les desks s\'échangent au quotidien.',
    moduleId: M4,
  },
  {
    terme: '€STR',
    en: 'euro short-term rate',
    definition:
      'Taux au jour le jour de la zone euro, calculé chaque jour par la BCE à partir des transactions réelles d\'emprunt en blanc déclarées par les banques. C\'est la référence du taux « sans risque » au jour le jour en euro.',
    moduleId: M4,
  },
  {
    terme: 'Euribor',
    definition:
      'Taux interbancaire offert en euro, publié quotidiennement pour des horizons de 1 semaine à 12 mois à partir des contributions d\'un panel de banques. Contrairement à l\'€STR, il incorpore un risque de crédit et de terme.',
    moduleId: M4,
  },
  {
    terme: 'FRN',
    en: 'floating rate note',
    definition:
      'Obligation à taux variable : le coupon est réindexé à chaque fixing sur un taux monétaire (typiquement Euribor 3 mois plus une marge). Son prix reste proche du pair tant que la qualité de crédit de l\'émetteur est stable.',
    moduleId: M4,
  },
  {
    terme: 'GC / spécial',
    en: 'general collateral / special',
    definition:
      'Au repo, un titre est GC quand n\'importe quel titre d\'un panier de qualité convient en garantie : le taux GC suit les taux directeurs. Un titre devient « spécial » quand il est spécifiquement recherché : son taux repo passe sous le GC, et l\'écart mesure l\'intensité de la demande.',
    moduleId: M4,
  },
  {
    terme: 'haircut',
    en: 'haircut',
    definition:
      'Décote appliquée à la valeur des titres mis en pension : avec un haircut de 2 %, 10 M€ de titres ne lèvent que 9,8 M€ de cash. Elle protège le prêteur contre une baisse du collatéral pendant l\'opération.',
    moduleId: M4,
  },
  {
    terme: 'immunisation',
    en: 'immunization',
    definition:
      'Technique de gestion actif-passif : égaliser la duration de l\'actif et celle du passif (à valeurs actuelles égales) pour neutraliser, au premier ordre, l\'effet d\'un mouvement de taux — effet prix et effet réinvestissement se compensent à l\'horizon de la duration.',
    moduleId: M4,
  },
  {
    terme: 'inversion de courbe',
    en: 'inverted yield curve',
    definition:
      'Configuration où les taux courts dépassent les taux longs : le marché anticipe des baisses de taux directeurs, scénario typique de ralentissement économique. Signal historiquement sérieux (1980, 1990, 2001, 2008), mais pas un oracle.',
    moduleId: M4,
  },
  {
    terme: 'maturité',
    en: 'maturity',
    definition:
      'Date de remboursement du nominal d\'une obligation, aussi appelée échéance. Elle date le dernier flux mais ne mesure pas à elle seule la sensibilité aux taux : c\'est le rôle de la duration.',
    moduleId: M4,
  },
  {
    terme: 'nominal',
    en: 'face value',
    definition:
      'Capital unitaire emprunté représenté par le titre, remboursé à maturité. Le coupon s\'exprime en pourcentage du nominal, et le prix cote en pourcentage du nominal.',
    moduleId: M4,
  },
  {
    terme: 'OAT',
    definition:
      'Obligation assimilable du Trésor : titre de dette à moyen-long terme de l\'État français, émis par adjudication mensuelle par l\'Agence France Trésor. La souche 10 ans la plus récente sert de référence au marché français.',
    moduleId: M4,
  },
  {
    terme: 'OATi',
    definition:
      'OAT indexée sur l\'inflation française hors tabac : le nominal est multiplié par un coefficient d\'indexation et le coupon, un taux réel fixe, s\'applique à ce nominal indexé. L\'OAT€i suit l\'inflation de la zone euro.',
    moduleId: M4,
  },
  {
    terme: 'obligation',
    en: 'bond',
    definition:
      'Titre de créance négociable : l\'émetteur emprunte un nominal, verse un coupon périodique et rembourse à maturité. À la différence d\'un prêt bancaire, le titre s\'achète et se revend librement sur un marché.',
    moduleId: M4,
  },
  {
    terme: 'prix propre',
    en: 'clean price',
    definition:
      'Prix coté sur les écrans, hors coupon couru — dit aussi « pied de coupon ». Cette convention neutralise la mécanique calendaire du couru pour ne refléter que les conditions de marché.',
    moduleId: M4,
  },
  {
    terme: 'prix sale',
    en: 'dirty price',
    definition:
      'Montant effectivement réglé à l\'achat d\'une obligation — dit aussi « plein coupon » : prix propre plus coupon couru.',
    moduleId: M4,
  },
  {
    terme: 'rendement actuariel',
    en: 'yield to maturity',
    definition:
      'Taux unique qui égalise le prix observé d\'une obligation et la somme de ses flux actualisés : le TRI de l\'investissement. C\'est un rendement promis sous conditions — détention jusqu\'à maturité et réinvestissement des coupons au même taux —, pas un rendement garanti.',
    moduleId: M4,
  },
  {
    terme: 'rendement courant',
    en: 'current yield',
    definition:
      'Coupon annuel rapporté au prix payé. Mesure instantanée qui ignore le remboursement et le calendrier des flux : sur un titre en surcote elle surestime le rendement complet, sur un titre décoté elle le sous-estime.',
    moduleId: M4,
  },
  {
    terme: 'repo',
    en: 'repurchase agreement',
    definition:
      'Pension livrée : vente de titres assortie de l\'engagement de les racheter à une date et un prix convenus — économiquement, un prêt de cash garanti par des titres. C\'est le mécanisme central de financement des desks obligataires et de formation des taux courts.',
    moduleId: M4,
  },
  {
    terme: 'spread souverain',
    en: 'sovereign spread',
    definition:
      'Écart de rendement actuariel entre deux dettes souveraines de même maturité, exprimé en points de base — OAT-Bund pour la France. Toujours une différence de rendements, jamais de prix, et à décomposer jambe par jambe avant interprétation.',
    moduleId: M4,
  },
  {
    terme: 'SVT',
    en: 'primary dealer',
    definition:
      'Spécialiste en valeurs du Trésor : banque agréée par l\'AFT qui s\'engage à soumissionner aux adjudications et à coter en continu la dette française au marché secondaire. Ils sont une quinzaine.',
    moduleId: M4,
  },
  {
    terme: 'syndication',
    definition:
      'Mode d\'émission où un syndicat de banques sonde les investisseurs, construit le livre d\'ordres, cale le prix et alloue les titres. Voie normale des entreprises — et des États pour les souches nouvelles ou très longues.',
    moduleId: M4,
  },
  {
    terme: 'taux forward',
    en: 'forward rate',
    definition:
      'Taux à terme implicite contenu dans la courbe : celui qui rend équivalents un placement long d\'un bloc et un placement court roulé. Un fait arithmétique imposé par l\'absence d\'arbitrage — pas une prévision des taux futurs.',
    moduleId: M4,
  },
  {
    terme: 'Treasury',
    definition:
      'Titre de dette de l\'État fédéral américain : T-bills à moins d\'un an, notes et bonds au-delà. La courbe des Treasuries est la référence mondiale du « sans risque » en dollar.',
    moduleId: M4,
  },
  {
    terme: 'zéro-coupon',
    en: 'zero-coupon bond',
    definition:
      'Obligation sans flux intermédiaire : un seul versement, le nominal, à l\'échéance — vendue sous le pair. Seul titre dont le rendement à maturité est verrouillé à l\'achat et dont la duration égale exactement la maturité.',
    moduleId: M4,
  },
];
