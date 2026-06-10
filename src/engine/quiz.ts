import { mulberry32, shuffle } from './rng';
import type { Difficulte, QcmQuestion } from './types';

export interface QcmSessionQuestion { question: QcmQuestion; ordreOptions: number[]; }
export interface ResultatQcm {
  bonnes: number; total: number;
  parTheme: Record<string, { bonnes: number; total: number }>;
  details: { questionId: string; reponseDonnee: number | null; correcte: boolean }[];
}

/**
 * Déterminisme :
 * - La sélection des questions dépend de la banque filtrée (à banque identique uniquement).
 * - L'ordre des options d'une question ne dépend que du seed et de l'id de la question :
 *   ajouter ou retirer une question de la banque ne modifie pas l'ordre des options
 *   des autres questions pour le même seed.
 */
function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export function composerSession(
  banque: QcmQuestion[],
  opts: { nb: number; moduleIds?: string[]; difficultes?: Difficulte[]; seed: number },
): QcmSessionQuestion[] {
  const rng = mulberry32(opts.seed);
  const pool = banque.filter(q =>
    (!opts.moduleIds || opts.moduleIds.includes(q.moduleId)) &&
    (!opts.difficultes || opts.difficultes.includes(q.difficulte)));
  return shuffle(rng, pool).slice(0, Math.max(0, opts.nb)).map(question => ({
    question,
    ordreOptions: shuffle(mulberry32(opts.seed ^ hashId(question.id)), question.options.map((_, i) => i)),
  }));
}

export function corrigerSession(session: QcmSessionQuestion[], reponses: (number | null)[]): ResultatQcm {
  const parTheme: ResultatQcm['parTheme'] = {};
  const details: ResultatQcm['details'] = [];
  let bonnes = 0;
  session.forEach((x, i) => {
    const rep = reponses[i] ?? null;
    const correcte = rep !== null && x.ordreOptions[rep] === x.question.bonneReponse;
    if (correcte) bonnes++;
    const t = (parTheme[x.question.theme] ??= { bonnes: 0, total: 0 });
    t.total++; if (correcte) t.bonnes++;
    details.push({ questionId: x.question.id, reponseDonnee: rep, correcte });
  });
  return { bonnes, total: session.length, parTheme, details };
}
