import { mulberry32, shuffle } from './rng';
import type { Difficulte, QcmQuestion } from './types';

export interface QcmSessionQuestion { question: QcmQuestion; ordreOptions: number[]; }
export interface ResultatQcm {
  bonnes: number; total: number;
  parTheme: Record<string, { bonnes: number; total: number }>;
  details: { questionId: string; reponseDonnee: number | null; correcte: boolean }[];
}

export function composerSession(
  banque: QcmQuestion[],
  opts: { nb: number; moduleIds?: string[]; difficultes?: Difficulte[]; seed: number },
): QcmSessionQuestion[] {
  const rng = mulberry32(opts.seed);
  const pool = banque.filter(q =>
    (!opts.moduleIds || opts.moduleIds.includes(q.moduleId)) &&
    (!opts.difficultes || opts.difficultes.includes(q.difficulte)));
  return shuffle(rng, pool).slice(0, opts.nb).map(question => ({
    question,
    ordreOptions: shuffle(rng, question.options.map((_, i) => i)),
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
