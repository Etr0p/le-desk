import type { ProblemGenerator } from '../../../engine/types';
import { problemesLot1 } from './problems-lot1';
import { problemesLot2 } from './problems-lot2';

// 20 moules × 3 scénarios : lot 1 = m12-pb-01…10 (4 N1 + 6 N2), lot 2 = m12-pb-11…20 (4 N3 + 6 boss N4).
export const problemes: ProblemGenerator[] = [...problemesLot1, ...problemesLot2];
