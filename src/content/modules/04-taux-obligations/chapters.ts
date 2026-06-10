import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch0', titre: 'Test du pipeline', ordre: 0 },
    charger: () => import('./chapters/00-test-pipeline.mdx'),
  },
];
