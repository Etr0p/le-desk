import { describe, expect, it } from 'vitest';
import { reponseCorrecte, parseSaisie, formatNombre } from './answers';

describe('reponseCorrecte', () => {
  it('accepte dans la tolérance relative', () => {
    expect(reponseCorrecte(1002, 1000, 0.005)).toBe(true);   // 0,2 %
    expect(reponseCorrecte(1006, 1000, 0.005)).toBe(false);  // 0,6 %
  });
  it('mode absolu', () => {
    expect(reponseCorrecte(3.52, 3.5, 0.05, 'absolu')).toBe(true);
    expect(reponseCorrecte(3.6, 3.5, 0.05, 'absolu')).toBe(false);
  });
  it('attendu nul → bascule en absolu', () => {
    expect(reponseCorrecte(0.001, 0, 0.01)).toBe(true);
  });
  it('rejette NaN', () => { expect(reponseCorrecte(NaN, 10, 0.1)).toBe(false); });
  it('borne exacte de tolérance relative est acceptée', () => {
    expect(reponseCorrecte(1005, 1000, 0.005)).toBe(true);
  });
});
describe('parseSaisie', () => {
  it('accepte virgule française et espaces', () => {
    expect(parseSaisie(' 1 027,75 ')).toBe(1027.75);
    expect(parseSaisie('1027.75')).toBe(1027.75);
    expect(parseSaisie('-0,5')).toBe(-0.5);
  });
  it('rejette le non-numérique', () => { expect(parseSaisie('abc')).toBeNull(); });
  it('rejette la saisie vide ou espaces', () => {
    expect(parseSaisie('')).toBeNull();
    expect(parseSaisie('   ')).toBeNull();
  });
});
describe('formatNombre', () => {
  it('format français', () => {
    // Le séparateur de milliers en fr-FR est U+202F (espace fine insécable, narrow no-break space)
    expect(formatNombre(1027.75)).toBe('1 027,75');
    expect(formatNombre(2.5, 1)).toBe('2,5');
  });
});
