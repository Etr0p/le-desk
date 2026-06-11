import type { ModuleContenu } from './types';
import { meta as m1 } from '../content/modules/01-panorama-marches/meta';
import { chapitres as c1 } from '../content/modules/01-panorama-marches/chapters';
import { exercices as e1 } from '../content/modules/01-panorama-marches/exercises';
import { problemes as p1 } from '../content/modules/01-panorama-marches/problems';
import { qcm as q1 } from '../content/modules/01-panorama-marches/qcm';
import { jury as j1 } from '../content/modules/01-panorama-marches/jury';
import { flashcards as f1 } from '../content/modules/01-panorama-marches/flashcards';
import { formules as fo1 } from '../content/modules/01-panorama-marches/formules';
import { meta as m2 } from '../content/modules/02-methodes-quantitatives/meta';
import { chapitres as c2 } from '../content/modules/02-methodes-quantitatives/chapters';
import { exercices as e2 } from '../content/modules/02-methodes-quantitatives/exercises';
import { problemes as p2 } from '../content/modules/02-methodes-quantitatives/problems';
import { qcm as q2 } from '../content/modules/02-methodes-quantitatives/qcm';
import { jury as j2 } from '../content/modules/02-methodes-quantitatives/jury';
import { flashcards as f2 } from '../content/modules/02-methodes-quantitatives/flashcards';
import { formules as fo2 } from '../content/modules/02-methodes-quantitatives/formules';
import { meta as m4 } from '../content/modules/04-taux-obligations/meta';
import { chapitres as c4 } from '../content/modules/04-taux-obligations/chapters';
import { exercices as e4 } from '../content/modules/04-taux-obligations/exercises';
import { problemes as p4 } from '../content/modules/04-taux-obligations/problems';
import { qcm as q4 } from '../content/modules/04-taux-obligations/qcm';
import { jury as j4 } from '../content/modules/04-taux-obligations/jury';
import { flashcards as f4 } from '../content/modules/04-taux-obligations/flashcards';
import { formules as fo4 } from '../content/modules/04-taux-obligations/formules';

export const modules: ModuleContenu[] = [
  { meta: m1, chapitres: c1, exercices: e1, problemes: p1, qcm: q1, jury: j1, flashcards: f1, formules: fo1 },
  { meta: m2, chapitres: c2, exercices: e2, problemes: p2, qcm: q2, jury: j2, flashcards: f2, formules: fo2 },
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
