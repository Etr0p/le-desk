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

  // Fix 2 — validation durcie
  it('import rejette cartes null, tableau, ou carte corrompue', () => {
    expect(() => importer('{"version":1,"cartes":null,"tentatives":[]}')).toThrow();
    expect(() => importer('{"version":1,"cartes":[1,2],"tentatives":[]}')).toThrow();
    expect(() => importer('{"version":1,"cartes":{"a":"lol"},"tentatives":[]}')).toThrow();
    expect(() => importer('{"version":1,"cartes":{"a":{"ease":"x","intervalJours":1,"echeance":"2026-07-01","repetitions":0}},"tentatives":[]}')).toThrow();
  });
  it('import répare les réglages/streak partiels ou invalides avec les défauts', () => {
    const e1 = importer('{"version":1,"cartes":{},"tentatives":[],"reglages":{"theme":"clair"}}');
    expect(e1.reglages.theme).toBe('clair');
    expect(e1.reglages.nouvellesCartesParJour).toBe(20);
    const e2 = importer('{"version":1,"cartes":{},"tentatives":[],"streak":{"serie":"abc","dernierJour":3}}');
    expect(e2.streak.serie).toBe(0);
    expect(e2.streak.dernierJour).toBe('');
  });
});
