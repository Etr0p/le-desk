import type { Langue } from './types';

/**
 * Retourne la valeur EN quand la langue est 'en' et que la valeur EN est définie,
 * sinon retourne la valeur FR (source de vérité).
 *
 * Usage :
 *   champ(langue, meta.titre, meta.titreEn)
 *   champ(langue, question.theme, question.themeEn)
 */
export function champ<T>(langue: Langue, fr: T, en?: T): T {
  return langue === 'en' && en !== undefined ? en : fr;
}

/**
 * Retourne le titre d'un module selon la langue.
 * Fallback sur le titre FR si titreEn absent.
 */
export function tituleModule(
  meta: { titre: string; titreEn?: string },
  langue: Langue,
): string {
  return champ(langue, meta.titre, meta.titreEn);
}

/**
 * Retourne la description d'un module selon la langue.
 * Fallback sur la description FR si descriptionEn absente.
 */
export function descriptionModule(
  meta: { description: string; descriptionEn?: string },
  langue: Langue,
): string {
  return champ(langue, meta.description, meta.descriptionEn);
}

/**
 * Retourne le titre d'un chapitre selon la langue.
 * Fallback sur le titre FR si titreEn absent.
 */
export function tituleChapitre(
  meta: { titre: string; titreEn?: string },
  langue: Langue,
): string {
  return champ(langue, meta.titre, meta.titreEn);
}
