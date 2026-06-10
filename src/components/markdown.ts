/* Mini-tokenizer pour les chaînes GÉNÉRÉES (énoncés, corrigés).
   Volontairement minimal : **gras**, *italique*, $math$ inline,
   $$math$$ en bloc, sauts de ligne, items « - » en début de ligne.
   Tout délimiteur non fermé est rendu en texte littéral. */

export type Inline =
  | { type: 'texte'; valeur: string }
  | { type: 'gras'; enfants: Inline[] }
  | { type: 'italique'; enfants: Inline[] }
  | { type: 'math'; tex: string };

export type Bloc =
  | { type: 'paragraphe'; lignes: Inline[][] }
  | { type: 'liste'; elements: Inline[][] }
  | { type: 'mathBloc'; tex: string };

export function tokeniserInline(texte: string): Inline[] {
  const tokens: Inline[] = [];
  let tampon = '';
  const vider = () => {
    if (tampon !== '') { tokens.push({ type: 'texte', valeur: tampon }); tampon = ''; }
  };

  let i = 0;
  while (i < texte.length) {
    if (texte.startsWith('**', i)) {
      const fin = texte.indexOf('**', i + 2);
      if (fin === -1) { tampon += '**'; i += 2; continue; }
      vider();
      tokens.push({ type: 'gras', enfants: tokeniserInline(texte.slice(i + 2, fin)) });
      i = fin + 2;
      continue;
    }
    if (texte[i] === '*') {
      const fin = texte.indexOf('*', i + 1);
      if (fin === -1) { tampon += '*'; i += 1; continue; }
      vider();
      tokens.push({ type: 'italique', enfants: tokeniserInline(texte.slice(i + 1, fin)) });
      i = fin + 1;
      continue;
    }
    if (texte.startsWith('$$', i)) {
      // Un $$ orphelin arrivé jusqu'ici n'a pas de fermant : littéral.
      tampon += '$$';
      i += 2;
      continue;
    }
    if (texte[i] === '$') {
      const fin = texte.indexOf('$', i + 1);
      if (fin === -1) { tampon += '$'; i += 1; continue; }
      vider();
      tokens.push({ type: 'math', tex: texte.slice(i + 1, fin) });
      i = fin + 1;
      continue;
    }
    tampon += texte[i];
    i += 1;
  }
  vider();
  return tokens;
}

/** Découpe les lignes d'un segment hors-math : paragraphes et listes. */
function blocsDepuisTexte(texte: string): Bloc[] {
  const blocs: Bloc[] = [];
  let paragraphe: Inline[][] = [];
  let liste: Inline[][] = [];

  const fermerParagraphe = () => {
    if (paragraphe.length > 0) { blocs.push({ type: 'paragraphe', lignes: paragraphe }); paragraphe = []; }
  };
  const fermerListe = () => {
    if (liste.length > 0) { blocs.push({ type: 'liste', elements: liste }); liste = []; }
  };

  for (const ligne of texte.split('\n')) {
    if (ligne.trim() === '') { fermerParagraphe(); fermerListe(); continue; }
    if (ligne.startsWith('- ')) {
      fermerParagraphe();
      liste.push(tokeniserInline(ligne.slice(2)));
      continue;
    }
    fermerListe();
    paragraphe.push(tokeniserInline(ligne));
  }
  fermerParagraphe();
  fermerListe();
  return blocs;
}

export function tokeniser(source: string): Bloc[] {
  const blocs: Bloc[] = [];
  let curseur = 0;

  // Extraction des blocs $$…$$ (potentiellement multi-lignes) ;
  // un $$ sans fermant est laissé au tokenizer inline → littéral.
  while (curseur < source.length) {
    const debut = source.indexOf('$$', curseur);
    const fin = debut === -1 ? -1 : source.indexOf('$$', debut + 2);
    if (debut === -1 || fin === -1) {
      blocs.push(...blocsDepuisTexte(source.slice(curseur)));
      return blocs;
    }
    blocs.push(...blocsDepuisTexte(source.slice(curseur, debut)));
    blocs.push({ type: 'mathBloc', tex: source.slice(debut + 2, fin).trim() });
    curseur = fin + 2;
  }
  return blocs;
}
