import { describe, expect, it } from 'vitest';
import { etatInitial, charger, sauver, exporter, importer, toucherStreak, type StorageLike } from './storage';

function fauxBackend(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
}

describe('storage', () => {
  it('charge l\'état initial si vide ou corrompu', () => {
    expect(charger(fauxBackend()).version).toBe(1);
    const b = fauxBackend(); b.setItem('le-desk-etat-v1', '{pas du json');
    expect(charger(b).version).toBe(1);
  });
  it('aller-retour sauver/charger', () => {
    const b = fauxBackend(); const e = etatInitial();
    e.chapitresLus['04/ch1'] = true; sauver(e, b);
    expect(charger(b).chapitresLus['04/ch1']).toBe(true);
  });
  it('aller-retour export/import', () => {
    const e = etatInitial(); e.streak.serie = 5;
    expect(importer(exporter(e)).streak.serie).toBe(5);
  });
  it('import rejette une sauvegarde invalide', () => {
    expect(() => importer('{"version":99}')).toThrow();
    expect(() => importer('quoi')).toThrow();
  });
  it('streak : incrémente si hier, conserve si même jour, repart sinon', () => {
    const e = etatInitial();
    toucherStreak(e, '2026-07-01'); expect(e.streak.serie).toBe(1);
    toucherStreak(e, '2026-07-01'); expect(e.streak.serie).toBe(1);
    toucherStreak(e, '2026-07-02'); expect(e.streak.serie).toBe(2);
    toucherStreak(e, '2026-07-10'); expect(e.streak.serie).toBe(1);
  });
});
