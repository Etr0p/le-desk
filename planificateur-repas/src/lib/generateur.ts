import type {
  Categorie,
  Criteres,
  Plat,
  RepasPlanifie,
  SemaineGeneree,
} from '../types';
import { LIBELLES_CATEGORIE } from '../types';
import { creerRng, graineAleatoire } from './rng';

/** Jours de la semaine utilisés pour étiqueter les repas. */
const JOURS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
];

export interface ResultatGeneration {
  repas: RepasPlanifie[];
  avertissements: string[];
}

/** Étiquette un index de repas avec un jour (cycle sur 7 jours). */
function etiquetteJour(index: number, total: number): string {
  if (total <= JOURS.length) {
    return JOURS[index];
  }
  // Plus de 7 repas : on précise midi / soir.
  const jour = JOURS[Math.floor(index / 2) % JOURS.length];
  return index % 2 === 0 ? `${jour} midi` : `${jour} soir`;
}

/**
 * Génère une semaine de repas à partir de la base de plats et des critères.
 *
 * Règles :
 *  - on satisfait d'abord les quotas par catégorie ;
 *  - on complète ensuite jusqu'au nombre total de repas avec des plats variés ;
 *  - jamais deux fois le même plat dans une même semaine ;
 *  - on privilégie les plats non utilisés lors des N dernières semaines.
 */
export function genererSemaine(
  plats: Plat[],
  criteres: Criteres,
  historique: SemaineGeneree[],
  graine: number = graineAleatoire(),
): ResultatGeneration {
  const rng = creerRng(graine);
  const avertissements: string[] = [];

  // Identifiants des plats utilisés dans les N dernières semaines.
  const recents = new Set<string>();
  const semainesRecentes = historique.slice(0, Math.max(0, criteres.eviterRepetitionSemaines));
  for (const semaine of semainesRecentes) {
    for (const r of semaine.repas) recents.add(r.platId);
  }

  const utilises = new Set<string>();

  /** Pioche un plat dans un sous-ensemble, en évitant doublons et plats récents. */
  function piocher(candidats: Plat[]): Plat | null {
    const dispo = candidats.filter((p) => !utilises.has(p.id));
    if (dispo.length === 0) return null;
    const frais = dispo.filter((p) => !recents.has(p.id));
    const source = frais.length > 0 ? frais : dispo;
    const choisi = source[Math.floor(rng() * source.length)];
    utilises.add(choisi.id);
    return choisi;
  }

  const choisis: Plat[] = [];

  // 1) Quotas par catégorie.
  for (const cat of Object.keys(criteres.parCategorie) as Categorie[]) {
    const voulu = criteres.parCategorie[cat] ?? 0;
    const platsCategorie = plats.filter((p) => p.categorie === cat);
    let obtenus = 0;
    for (let i = 0; i < voulu; i++) {
      const plat = piocher(platsCategorie);
      if (!plat) break;
      choisis.push(plat);
      obtenus++;
    }
    if (obtenus < voulu) {
      avertissements.push(
        `Pas assez de plats « ${LIBELLES_CATEGORIE[cat]} » : ${obtenus}/${voulu} placés. Ajoutez-en dans « Mes plats ».`,
      );
    }
  }

  const totalCible = Math.max(criteres.totalRepas, choisis.length);
  if (choisis.length > criteres.totalRepas) {
    avertissements.push(
      `Les quotas par catégorie (${choisis.length}) dépassent le nombre total de repas (${criteres.totalRepas}). La semaine en contient ${choisis.length}.`,
    );
  }

  // 2) Complément jusqu'au total visé, toutes catégories confondues.
  let manquePlats = false;
  while (choisis.length < totalCible) {
    const plat = piocher(plats);
    if (!plat) {
      manquePlats = true;
      break;
    }
    choisis.push(plat);
  }
  if (manquePlats) {
    avertissements.push(
      `Pas assez de plats différents pour atteindre ${criteres.totalRepas} repas. Semaine de ${choisis.length} repas générée.`,
    );
  }

  // 3) Mélange final pour ne pas regrouper les plats par catégorie.
  for (let i = choisis.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [choisis[i], choisis[j]] = [choisis[j], choisis[i]];
  }

  const repas: RepasPlanifie[] = choisis.map((plat, index) => ({
    jour: etiquetteJour(index, choisis.length),
    platId: plat.id,
    nom: plat.nom,
    categorie: plat.categorie,
  }));

  return { repas, avertissements };
}
