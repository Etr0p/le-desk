import { mulberry32, shuffle, randInt } from './rng';
import { composerSession, type QcmSessionQuestion } from './quiz';
import type { JuryQuestion, ModuleContenu, ProblemGenerator } from './types';

/** Contient des références de fonctions : ne jamais persister tel quel — persister le seed et recomposer. */
export interface ExamenCompose {
  qcm: QcmSessionQuestion[];
  problemes: { generateur: ProblemGenerator; seed: number; scenario: number }[];
  jury: JuryQuestion[];
}

export function composerExamen(contenus: ModuleContenu[], seed: number): ExamenCompose {
  const rng = mulberry32(seed);

  // Dériver un sous-seed pour la composition QCM : composerSession crée son propre rng
  // et ne consomme pas le flux parent au-delà de ce tirage unique.
  const qcmSeed = randInt(rng, 1, 2 ** 31 - 1);
  const tousQcm = contenus.flatMap(m => m.qcm);
  const qcm = composerSession(tousQcm, { nb: 20, seed: qcmSeed });

  // --- Problèmes ---
  const tousProblemes: ProblemGenerator[] = contenus.flatMap(m => m.problemes);
  const shuffled = shuffle(rng, tousProblemes);

  // Sélectionner jusqu'à 4 problèmes distincts par id (le mélange assure le caractère aléatoire)
  const choisis: ProblemGenerator[] = [];
  const vus = new Set<string>();
  for (const g of shuffled) {
    if (!vus.has(g.id)) { vus.add(g.id); choisis.push(g); }
    if (choisis.length === 4) break;
  }

  // Garantir qu'au moins un problème a une difficulté ≥ 3 si le pool en contient un
  const hasDiff3 = choisis.some(g => g.difficulte >= 3);
  if (!hasDiff3) {
    const choisisIds = new Set(choisis.map(g => g.id));
    const candidate = shuffled.find(g => g.difficulte >= 3 && !choisisIds.has(g.id));
    if (candidate) {
      choisis[choisis.length - 1] = candidate;
    }
  }

  const problemes = choisis.map(g => ({
    generateur: g,
    seed: randInt(rng, 1, 2 ** 31 - 1),
    scenario: randInt(rng, 0, g.scenarios.length - 1),
  }));

  // --- Jury ---
  const tousJury: JuryQuestion[] = contenus.flatMap(m => m.jury);
  const shuffledJury = shuffle(rng, tousJury);

  const juryChoisi: JuryQuestion[] = [];
  const juryMods = new Set<string>();

  // Premier passage : privilégier des moduleIds distincts
  for (const j of shuffledJury) {
    if (!juryMods.has(j.moduleId)) {
      juryMods.add(j.moduleId);
      juryChoisi.push(j);
    }
    if (juryChoisi.length === 2) break;
  }

  // Second passage : compléter jusqu'à 2 si les modules distincts sont insuffisants
  if (juryChoisi.length < 2) {
    const juryIds = new Set(juryChoisi.map(j => j.id));
    for (const j of shuffledJury) {
      if (!juryIds.has(j.id)) {
        juryChoisi.push(j);
        juryIds.add(j.id);
      }
      if (juryChoisi.length === 2) break;
    }
  }

  return { qcm, problemes, jury: juryChoisi };
}
