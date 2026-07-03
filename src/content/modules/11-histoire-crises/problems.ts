import type { ProblemGenerator } from '../../../engine/types';
import { problemesLot1 } from './problems-lot1';
import { problemesLot2 } from './problems-lot2';

// 14 moules × 3 scénarios : lot 1 = m11-pb-01…08 (N1-N2), lot 2 = m11-pb-09…14 (6 boss N4).
// Module culture (comme le m1 et le m10) : cible réduite par rapport aux modules quantitatifs.
export const problemes: ProblemGenerator[] = [...problemesLot1, ...problemesLot2];
