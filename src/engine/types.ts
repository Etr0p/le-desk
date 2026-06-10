import type { ComponentType } from 'react';

export type Langue = 'fr' | 'en';
// 'fr' est la langue source : tout le contenu existe en français.
// Les champs *En sont optionnels — en leur absence, on retombe sur le français.

export type Difficulte = 1 | 2 | 3 | 4;
// 1 échauffement · 2 classique · 3 avancé · 4 très difficile (« boss »)

export interface ModuleMeta {
  id: string;          // "04-taux-obligations"
  numero: number;      // 4
  titre: string;
  description: string;
  quantitatif: boolean;
  titreEn?: string;
  descriptionEn?: string;
}
export interface ChapitreMeta { id: string; titre: string; ordre: number; titreEn?: string; }
export interface ChapitreRef {
  meta: ChapitreMeta;
  charger: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
  /** Variante anglaise du chapitre (MDX). Absente → fallback sur la version française. */
  chargerEn?: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
}

export interface Etape { titre: string; contenu: string; } // markdown + KaTeX inline ($…$)

export interface GeneratedExercise {
  enonce: string;
  reponse: number;
  tolerance: number;                    // ex. 0.005 = 0,5 %
  toleranceMode?: 'relatif' | 'absolu'; // défaut : relatif
  unite?: string;                       // "€", "%", "années"…
  etapes: Etape[];                      // corrigé pas à pas, valeurs insérées
  pieges?: string[];                    // erreurs classiques explicitées
}
export interface ExerciseGenerator {
  id: string; moduleId: string; titre: string; difficulte: Difficulte;
  titreEn?: string;
  /** `langue` est optionnelle : un générateur peut l'ignorer (sortie FR par défaut). */
  generate(seed: number, langue?: Langue): GeneratedExercise;
}

export interface GeneratedProblem {
  contexte: string; // mise en situation, valeurs insérées
  sousQuestions: (GeneratedExercise & { intitule: string })[]; // 3 à 6, chaînées
}
export interface ProblemGenerator {
  id: string; moduleId: string; titre: string;
  typeDeCas: string;        // taxonomie du module, ex. "couverture"
  difficulte: Difficulte;
  scenarios: string[];      // 2 à 4 variantes de contexte (FR, source de vérité)
  titreEn?: string;
  typeDeCasEn?: string;
  scenariosEn?: string[];   // même longueur que scenarios si présent
  /** `langue` est optionnelle : un générateur peut l'ignorer (sortie FR par défaut). */
  generate(seed: number, scenario: number, langue?: Langue): GeneratedProblem;
}

export interface QcmQuestion {
  id: string; moduleId: string; theme: string; difficulte: Difficulte;
  question: string;
  options: string[];        // 4 options
  bonneReponse: number;     // index dans options
  explications: string[];   // même longueur : pourquoi juste / pourquoi piège
  questionEn?: string;
  optionsEn?: string[];     // même longueur que options si présent
  explicationsEn?: string[];
  themeEn?: string;
}

export interface JuryQuestion {
  id: string; moduleId: string; theme: string; difficulte: Difficulte;
  question: string;
  plan: string[];           // structure de réponse attendue
  pointsAttendus: string[]; // ce que le jury veut entendre
  bonus?: string[];         // ce qui impressionne
  reponseModele: string;    // réponse rédigée complète (markdown + KaTeX)
  questionEn?: string;
  planEn?: string[];
  pointsAttendusEn?: string[];
  bonusEn?: string[];
  reponseModeleEn?: string;
  themeEn?: string;
}

export interface Flashcard {
  id: string; moduleId: string; tags: string[]; recto: string; verso: string;
  rectoEn?: string; versoEn?: string;
}
export interface GlossaireEntree {
  terme: string;
  en?: string;              // terme anglais (déjà présent : c'est le TERME, pas la définition)
  definition: string;
  definitionEn?: string;
  moduleId?: string;
}
export interface Formule {
  id: string; moduleId: string; nom: string; latex: string; commentaire?: string;
  nomEn?: string; commentaireEn?: string;
}

export interface ModuleContenu {
  meta: ModuleMeta;
  chapitres: ChapitreRef[];
  exercices: ExerciseGenerator[];
  problemes: ProblemGenerator[];
  qcm: QcmQuestion[];
  jury: JuryQuestion[];
  flashcards: Flashcard[];
  formules: Formule[];
}
