// Types partagés de l'application.

/** Catégories de plats prises en compte par le générateur. */
export type Categorie =
  | 'vegetarien'
  | 'pates'
  | 'viande'
  | 'poisson'
  | 'oeufs'
  | 'autre';

export const CATEGORIES: Categorie[] = [
  'vegetarien',
  'pates',
  'viande',
  'poisson',
  'oeufs',
  'autre',
];

/** Libellés affichés pour chaque catégorie. */
export const LIBELLES_CATEGORIE: Record<Categorie, string> = {
  vegetarien: 'Végétarien',
  pates: 'Pâtes',
  viande: 'Viande',
  poisson: 'Poisson',
  oeufs: 'Œufs',
  autre: 'Autre',
};

/** Emoji associé à chaque catégorie (purement décoratif). */
export const EMOJI_CATEGORIE: Record<Categorie, string> = {
  vegetarien: '🥦',
  pates: '🍝',
  viande: '🥩',
  poisson: '🐟',
  oeufs: '🥚',
  autre: '🍽️',
};

/** Un plat de la base de données. */
export interface Plat {
  id: string;
  nom: string;
  categorie: Categorie;
  tags?: string[];
}

/** Critères de génération d'une semaine. */
export interface Criteres {
  /** Nombre total de repas voulus dans la semaine. */
  totalRepas: number;
  /** Nombre de plats imposés par catégorie. */
  parCategorie: Partial<Record<Categorie, number>>;
  /** Éviter de reprendre un plat utilisé dans les N dernières semaines. */
  eviterRepetitionSemaines: number;
}

/** Un repas planifié pour un jour donné. */
export interface RepasPlanifie {
  jour: string;
  platId: string;
  nom: string;
  categorie: Categorie;
}

/** Une semaine générée et sauvegardée. */
export interface SemaineGeneree {
  id: string;
  dateGeneration: string;
  repas: RepasPlanifie[];
}

/** État complet persisté dans le localStorage. */
export interface EtatApp {
  plats: Plat[];
  criteres: Criteres;
  historique: SemaineGeneree[];
}
