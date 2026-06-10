import { describe, expect, it } from 'vitest';
import { tokeniser } from './markdown';

describe('tokeniser — texte brut', () => {
  it('chaîne vide → aucun bloc', () => {
    expect(tokeniser('')).toEqual([]);
  });

  it('texte simple → un paragraphe, un token texte (passthrough)', () => {
    expect(tokeniser('Bonjour le desk')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Bonjour le desk' }]] },
    ]);
  });
});

describe('tokeniser — segments inline', () => {
  it('découpe gras, math et italique dans le bon ordre', () => {
    expect(tokeniser('Le **prix** vaut $P_0$ en *euros*')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[
          { type: 'texte', valeur: 'Le ' },
          { type: 'gras', enfants: [{ type: 'texte', valeur: 'prix' }] },
          { type: 'texte', valeur: ' vaut ' },
          { type: 'math', tex: 'P_0' },
          { type: 'texte', valeur: ' en ' },
          { type: 'italique', enfants: [{ type: 'texte', valeur: 'euros' }] },
        ]],
      },
    ]);
  });

  it('math imbriquée dans du gras', () => {
    expect(tokeniser('**prix $P$**')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[
          { type: 'gras', enfants: [{ type: 'texte', valeur: 'prix ' }, { type: 'math', tex: 'P' }] },
        ]],
      },
    ]);
  });

  it('$ non fermé → rendu en texte littéral', () => {
    expect(tokeniser('environ 100 $')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'environ 100 $' }]] },
    ]);
  });

  it('** non fermé → rendu en texte littéral', () => {
    expect(tokeniser('a ** b')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'a ** b' }]] },
    ]);
  });
});

describe('tokeniser — listes', () => {
  it('groupe les lignes « - » consécutives en un seul bloc liste', () => {
    expect(tokeniser('Intro\n- un\n- deux\nFin')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Intro' }]] },
      {
        type: 'liste',
        elements: [
          [{ type: 'texte', valeur: 'un' }],
          [{ type: 'texte', valeur: 'deux' }],
        ],
      },
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Fin' }]] },
    ]);
  });

  it('les items de liste sont tokenisés inline', () => {
    expect(tokeniser('- taux **réel**')).toEqual([
      {
        type: 'liste',
        elements: [[
          { type: 'texte', valeur: 'taux ' },
          { type: 'gras', enfants: [{ type: 'texte', valeur: 'réel' }] },
        ]],
      },
    ]);
  });
});

describe('tokeniser — sauts de ligne et paragraphes', () => {
  it('saut simple → deux lignes du même paragraphe', () => {
    expect(tokeniser('a\nb')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[{ type: 'texte', valeur: 'a' }], [{ type: 'texte', valeur: 'b' }]],
      },
    ]);
  });

  it('ligne vide → deux paragraphes distincts', () => {
    expect(tokeniser('a\n\nb')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'a' }]] },
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'b' }]] },
    ]);
  });
});

describe('tokeniser — math en bloc', () => {
  it('$$…$$ devient un bloc math, le tex est nettoyé', () => {
    expect(tokeniser('Avant\n$$P = \\frac{C}{r}$$\nAprès')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Avant' }]] },
      { type: 'mathBloc', tex: 'P = \\frac{C}{r}' },
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Après' }]] },
    ]);
  });

  it('$$…$$ peut s’étendre sur plusieurs lignes', () => {
    expect(tokeniser('$$\nx = 1\n$$')).toEqual([
      { type: 'mathBloc', tex: 'x = 1' },
    ]);
  });

  it('$$ non fermé → texte littéral', () => {
    expect(tokeniser('reste $$ ouvert')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'reste $$ ouvert' }]] },
    ]);
  });
});
