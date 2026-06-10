import type { ModuleContenu } from './types';
import { meta as m4 } from '../content/modules/04-taux-obligations/meta';
import { chapitres as c4 } from '../content/modules/04-taux-obligations/chapters';
import { exercices as e4 } from '../content/modules/04-taux-obligations/exercises';
import { problemes as p4 } from '../content/modules/04-taux-obligations/problems';
import { qcm as q4 } from '../content/modules/04-taux-obligations/qcm';
import { jury as j4 } from '../content/modules/04-taux-obligations/jury';
import { flashcards as f4 } from '../content/modules/04-taux-obligations/flashcards';
import { formules as fo4 } from '../content/modules/04-taux-obligations/formules';

export const modules: ModuleContenu[] = [
  { meta: m4, chapitres: c4, exercices: e4, problemes: p4, qcm: q4, jury: j4, flashcards: f4, formules: fo4 },
];
export function getModule(id: string): ModuleContenu | undefined {
  return modules.find(m => m.meta.id === id);
}
export function tousLesExercices() { return modules.flatMap(m => m.exercices); }
export function tousLesProblemes() { return modules.flatMap(m => m.problemes); }
export function touteLaBanqueQcm() { return modules.flatMap(m => m.qcm); }
export function toutesLesQuestionsJury() { return modules.flatMap(m => m.jury); }
export function toutesLesFlashcards() { return modules.flatMap(m => m.flashcards); }
