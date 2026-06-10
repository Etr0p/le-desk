import { describe, expect, it } from 'vitest';
import { tokeniser } from './markdown';

describe('tokeniser — texte brut', () => {
  it('chaine vide => aucun bloc', () => {
    expect(tokeniser('')).toEqual([]);
  });

  it('texte simple => un paragraphe, un token texte (passthrough)', () => {
    expect(tokeniser('Bonjour le desk')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Bonjour le desk' }]] },
    ]);
  });
});

describe('tokeniser — segments inline', () => {
  it('decoupe gras, math et italique dans le bon ordre', () => {
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

  it('math imbriquee dans du gras', () => {
    expect(tokeniser('**prix $P$**')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[
          { type: 'gras', enfants: [{ type: 'texte', valeur: 'prix ' }, { type: 'math', tex: 'P' }] },
        ]],
      },
    ]);
  });

  it('$ non ferme => rendu en texte litteral', () => {
    expect(tokeniser('environ 100 $')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'environ 100 $' }]] },
    ]);
  });

  it('** non ferme => rendu en texte litteral', () => {
    expect(tokeniser('a ** b')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'a ** b' }]] },
    ]);
  });
});

describe('tokeniser — listes', () => {
  it('groupe les lignes "- " consecutives en un seul bloc liste', () => {
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

  it('les items de liste sont tokenises inline', () => {
    expect(tokeniser('- taux **reel**')).toEqual([
      {
        type: 'liste',
        elements: [[
          { type: 'texte', valeur: 'taux ' },
          { type: 'gras', enfants: [{ type: 'texte', valeur: 'reel' }] },
        ]],
      },
    ]);
  });
});

describe('tokeniser — sauts de ligne et paragraphes', () => {
  it('saut simple => deux lignes du meme paragraphe', () => {
    expect(tokeniser('a\nb')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[{ type: 'texte', valeur: 'a' }], [{ type: 'texte', valeur: 'b' }]],
      },
    ]);
  });

  it('ligne vide => deux paragraphes distincts', () => {
    expect(tokeniser('a\n\nb')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'a' }]] },
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'b' }]] },
    ]);
  });
});

describe('tokeniser — math en bloc', () => {
  it('$$ ... $$ devient un bloc math, le tex est nettoye', () => {
    expect(tokeniser('Avant\n$$P = \\frac{C}{r}$$\nApres')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Avant' }]] },
      { type: 'mathBloc', tex: 'P = \\frac{C}{r}' },
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'Apres' }]] },
    ]);
  });

  it('$$ ... $$ peut s\'etendre sur plusieurs lignes', () => {
    expect(tokeniser('$$\nx = 1\n$$')).toEqual([
      { type: 'mathBloc', tex: 'x = 1' },
    ]);
  });

  it('$$ non ferme => texte litteral', () => {
    expect(tokeniser('reste $$ ouvert')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'reste $$ ouvert' }]] },
    ]);
  });
});

describe('tokeniser — heuristique dollar et CRLF', () => {
  it('ne transforme pas les montants en dollars en maths', () => {
    // '100 $ et le Bund 200 $' : le $ est precede d'un espace => pas de math
    expect(tokeniser('vaut 100 $ et le Bund 200 $')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[{ type: 'texte', valeur: 'vaut 100 $ et le Bund 200 $' }]],
      },
    ]);
  });

  it('\\$ produit un dollar litteral', () => {
    // 'cout de \\$5' => texte 'cout de $5'
    expect(tokeniser('cout de \\$5')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[{ type: 'texte', valeur: 'cout de $5' }]],
      },
    ]);
  });

  it('$x$ reste des maths quand colle au contenu', () => {
    // 'prix $P_0$ donne' => token math 'P_0'
    expect(tokeniser('prix $P_0$ donne')).toEqual([
      {
        type: 'paragraphe',
        lignes: [[
          { type: 'texte', valeur: 'prix ' },
          { type: 'math', tex: 'P_0' },
          { type: 'texte', valeur: ' donne' },
        ]],
      },
    ]);
  });

  it('gere les fins de ligne CRLF', () => {
    // 'a\r\n- x\r\n- y' => liste de 2 items sans \r
    expect(tokeniser('a\r\n- x\r\n- y')).toEqual([
      { type: 'paragraphe', lignes: [[{ type: 'texte', valeur: 'a' }]] },
      {
        type: 'liste',
        elements: [
          [{ type: 'texte', valeur: 'x' }],
          [{ type: 'texte', valeur: 'y' }],
        ],
      },
    ]);
  });
});
