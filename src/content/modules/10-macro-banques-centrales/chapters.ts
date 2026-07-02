import type { ChapitreRef } from '../../../engine/types';

// Câblage FR des 7 chapitres — les `chargerEn`/`titreEn` et la synthèse (ordre 8)
// viendront avec la vague de traductions.
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'La banque centrale : le mandat et la promesse des 2 %', ordre: 1 },
    charger: () => import('./chapters/01-le-mandat.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Les taux directeurs : le levier et sa règle', ordre: 2 },
    charger: () => import('./chapters/02-les-taux-directeurs.mdx'),
  },
  {
    meta: { id: 'ch3', titre: "La transmission : du taux directeur à l'économie réelle", ordre: 3 },
    charger: () => import('./chapters/03-la-transmission.mdx'),
  },
  {
    meta: { id: 'ch4', titre: "L'inflation : la mesurer, la comprendre, la combattre", ordre: 4 },
    charger: () => import('./chapters/04-l-inflation.mdx'),
  },
  {
    meta: { id: 'ch5', titre: "QE, QT et l'arsenal non conventionnel", ordre: 5 },
    charger: () => import('./chapters/05-qe-qt-non-conventionnel.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Les indicateurs : le calendrier qui fait trembler les desks', ordre: 6 },
    charger: () => import('./chapters/06-les-indicateurs.mdx'),
  },
  {
    meta: { id: 'ch7', titre: "Les classes d'actifs sous le cycle — et les jours où tout casse", ordre: 7 },
    charger: () => import('./chapters/07-classes-d-actifs-episodes.mdx'),
  },
];
