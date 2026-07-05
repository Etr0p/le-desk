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
import { meta as m3 } from '../content/modules/03-actions-indices/meta';
import { chapitres as c3 } from '../content/modules/03-actions-indices/chapters';
import { exercices as e3 } from '../content/modules/03-actions-indices/exercises';
import { problemes as p3 } from '../content/modules/03-actions-indices/problems';
import { qcm as q3 } from '../content/modules/03-actions-indices/qcm';
import { jury as j3 } from '../content/modules/03-actions-indices/jury';
import { flashcards as f3 } from '../content/modules/03-actions-indices/flashcards';
import { formules as fo3 } from '../content/modules/03-actions-indices/formules';
import { meta as m4 } from '../content/modules/04-taux-obligations/meta';
import { chapitres as c4 } from '../content/modules/04-taux-obligations/chapters';
import { exercices as e4 } from '../content/modules/04-taux-obligations/exercises';
import { problemes as p4 } from '../content/modules/04-taux-obligations/problems';
import { qcm as q4 } from '../content/modules/04-taux-obligations/qcm';
import { jury as j4 } from '../content/modules/04-taux-obligations/jury';
import { flashcards as f4 } from '../content/modules/04-taux-obligations/flashcards';
import { formules as fo4 } from '../content/modules/04-taux-obligations/formules';
import { meta as m5 } from '../content/modules/05-credit/meta';
import { chapitres as c5 } from '../content/modules/05-credit/chapters';
import { exercices as e5 } from '../content/modules/05-credit/exercises';
import { problemes as p5 } from '../content/modules/05-credit/problems';
import { qcm as q5 } from '../content/modules/05-credit/qcm';
import { jury as j5 } from '../content/modules/05-credit/jury';
import { flashcards as f5 } from '../content/modules/05-credit/flashcards';
import { formules as fo5 } from '../content/modules/05-credit/formules';
import { meta as m6 } from '../content/modules/06-change-commos-crypto/meta';
import { chapitres as c6 } from '../content/modules/06-change-commos-crypto/chapters';
import { exercices as e6 } from '../content/modules/06-change-commos-crypto/exercises';
import { problemes as p6 } from '../content/modules/06-change-commos-crypto/problems';
import { qcm as q6 } from '../content/modules/06-change-commos-crypto/qcm';
import { jury as j6 } from '../content/modules/06-change-commos-crypto/jury';
import { flashcards as f6 } from '../content/modules/06-change-commos-crypto/flashcards';
import { formules as fo6 } from '../content/modules/06-change-commos-crypto/formules';
import { meta as m7 } from '../content/modules/07-derives-fermes/meta';
import { chapitres as c7 } from '../content/modules/07-derives-fermes/chapters';
import { exercices as e7 } from '../content/modules/07-derives-fermes/exercises';
import { problemes as p7 } from '../content/modules/07-derives-fermes/problems';
import { qcm as q7 } from '../content/modules/07-derives-fermes/qcm';
import { jury as j7 } from '../content/modules/07-derives-fermes/jury';
import { flashcards as f7 } from '../content/modules/07-derives-fermes/flashcards';
import { formules as fo7 } from '../content/modules/07-derives-fermes/formules';
import { meta as m8 } from '../content/modules/08-options-volatilite/meta';
import { chapitres as c8 } from '../content/modules/08-options-volatilite/chapters';
import { exercices as e8 } from '../content/modules/08-options-volatilite/exercises';
import { problemes as p8 } from '../content/modules/08-options-volatilite/problems';
import { qcm as q8 } from '../content/modules/08-options-volatilite/qcm';
import { jury as j8 } from '../content/modules/08-options-volatilite/jury';
import { flashcards as f8 } from '../content/modules/08-options-volatilite/flashcards';
import { formules as fo8 } from '../content/modules/08-options-volatilite/formules';
import { meta as m9 } from '../content/modules/09-produits-structures/meta';
import { chapitres as c9 } from '../content/modules/09-produits-structures/chapters';
import { exercices as e9 } from '../content/modules/09-produits-structures/exercises';
import { problemes as p9 } from '../content/modules/09-produits-structures/problems';
import { qcm as q9 } from '../content/modules/09-produits-structures/qcm';
import { jury as j9 } from '../content/modules/09-produits-structures/jury';
import { flashcards as f9 } from '../content/modules/09-produits-structures/flashcards';
import { formules as fo9 } from '../content/modules/09-produits-structures/formules';
import { meta as m10 } from '../content/modules/10-macro-banques-centrales/meta';
import { chapitres as c10 } from '../content/modules/10-macro-banques-centrales/chapters';
import { exercices as e10 } from '../content/modules/10-macro-banques-centrales/exercises';
import { problemes as p10 } from '../content/modules/10-macro-banques-centrales/problems';
import { qcm as q10 } from '../content/modules/10-macro-banques-centrales/qcm';
import { jury as j10 } from '../content/modules/10-macro-banques-centrales/jury';
import { flashcards as f10 } from '../content/modules/10-macro-banques-centrales/flashcards';
import { formules as fo10 } from '../content/modules/10-macro-banques-centrales/formules';
import { meta as m11 } from '../content/modules/11-histoire-crises/meta';
import { chapitres as c11 } from '../content/modules/11-histoire-crises/chapters';
import { exercices as e11 } from '../content/modules/11-histoire-crises/exercises';
import { problemes as p11 } from '../content/modules/11-histoire-crises/problems';
import { qcm as q11 } from '../content/modules/11-histoire-crises/qcm';
import { jury as j11 } from '../content/modules/11-histoire-crises/jury';
import { flashcards as f11 } from '../content/modules/11-histoire-crises/flashcards';
import { formules as fo11 } from '../content/modules/11-histoire-crises/formules';
import { meta as m12 } from '../content/modules/12-gestion-actifs-risques/meta';
import { chapitres as c12 } from '../content/modules/12-gestion-actifs-risques/chapters';
import { exercices as e12 } from '../content/modules/12-gestion-actifs-risques/exercises';
import { problemes as p12 } from '../content/modules/12-gestion-actifs-risques/problems';
import { qcm as q12 } from '../content/modules/12-gestion-actifs-risques/qcm';
import { jury as j12 } from '../content/modules/12-gestion-actifs-risques/jury';
import { flashcards as f12 } from '../content/modules/12-gestion-actifs-risques/flashcards';
import { formules as fo12 } from '../content/modules/12-gestion-actifs-risques/formules';
import { meta as m13 } from '../content/modules/13-brainteasers-oral/meta';
import { chapitres as c13 } from '../content/modules/13-brainteasers-oral/chapters';
import { exercices as e13 } from '../content/modules/13-brainteasers-oral/exercises';
import { problemes as p13 } from '../content/modules/13-brainteasers-oral/problems';
import { qcm as q13 } from '../content/modules/13-brainteasers-oral/qcm';
import { jury as j13 } from '../content/modules/13-brainteasers-oral/jury';
import { flashcards as f13 } from '../content/modules/13-brainteasers-oral/flashcards';
import { formules as fo13 } from '../content/modules/13-brainteasers-oral/formules';

export const modules: ModuleContenu[] = [
  { meta: m1, chapitres: c1, exercices: e1, problemes: p1, qcm: q1, jury: j1, flashcards: f1, formules: fo1 },
  { meta: m2, chapitres: c2, exercices: e2, problemes: p2, qcm: q2, jury: j2, flashcards: f2, formules: fo2 },
  { meta: m3, chapitres: c3, exercices: e3, problemes: p3, qcm: q3, jury: j3, flashcards: f3, formules: fo3 },
  { meta: m4, chapitres: c4, exercices: e4, problemes: p4, qcm: q4, jury: j4, flashcards: f4, formules: fo4 },
  { meta: m5, chapitres: c5, exercices: e5, problemes: p5, qcm: q5, jury: j5, flashcards: f5, formules: fo5 },
  { meta: m6, chapitres: c6, exercices: e6, problemes: p6, qcm: q6, jury: j6, flashcards: f6, formules: fo6 },
  { meta: m7, chapitres: c7, exercices: e7, problemes: p7, qcm: q7, jury: j7, flashcards: f7, formules: fo7 },
  { meta: m8, chapitres: c8, exercices: e8, problemes: p8, qcm: q8, jury: j8, flashcards: f8, formules: fo8 },
  { meta: m9, chapitres: c9, exercices: e9, problemes: p9, qcm: q9, jury: j9, flashcards: f9, formules: fo9 },
  { meta: m10, chapitres: c10, exercices: e10, problemes: p10, qcm: q10, jury: j10, flashcards: f10, formules: fo10 },
  { meta: m11, chapitres: c11, exercices: e11, problemes: p11, qcm: q11, jury: j11, flashcards: f11, formules: fo11 },
  { meta: m12, chapitres: c12, exercices: e12, problemes: p12, qcm: q12, jury: j12, flashcards: f12, formules: fo12 },
  { meta: m13, chapitres: c13, exercices: e13, problemes: p13, qcm: q13, jury: j13, flashcards: f13, formules: fo13 },
];
export function getModule(id: string): ModuleContenu | undefined {
  return modules.find(m => m.meta.id === id);
}
export function tousLesExercices() { return modules.flatMap(m => m.exercices); }
export function tousLesProblemes() { return modules.flatMap(m => m.problemes); }
export function touteLaBanqueQcm() { return modules.flatMap(m => m.qcm); }
export function toutesLesQuestionsJury() { return modules.flatMap(m => m.jury); }
export function toutesLesFlashcards() { return modules.flatMap(m => m.flashcards); }
