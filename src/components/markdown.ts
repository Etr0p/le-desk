/* Mini-tokenizer pour les chaines GENEREES (enonces, corriges).
   Volontairement minimal : **gras**, *italique*, $math$ inline,
   $$math$$ en bloc, sauts de ligne, items "- " en debut de ligne.
   Tout delimiter non ferme est rendu en texte litteral.

   REGLES DE REDACTION (auteurs de contenu)
   ─────────────────────────────────────────
   · Math en bloc : ecrire $$ sur sa propre ligne (avant et apres l'expression).
     Exemple :
       $$
       P = \frac{C}{r}
       $$
     Un $$ ... $$ au milieu d'une ligne coupe le paragraphe — eviter.

   · Math inline : coller le $ directement au contenu ($P_0$, $r_{nom}$).
     Un espace avant ou apres le $ (ex : "100 $") produit un dollar litteral,
     jamais un debut/fin de math.

   · Dollar litteral : ecrire \$ (par ex. "cout de \$5"). */

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
    // Echappement \$ -> dollar litteral
    if (texte[i] === '\\' && texte[i + 1] === '$') {
      tampon += '$';
      i += 2;
      continue;
    }
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
      // Un $$ orphelin arrive jusqu'ici n'a pas de fermant : litteral.
      tampon += '$$';
      i += 2;
      continue;
    }
    if (texte[i] === '$') {
      // CommonMark-style : ouvre seulement si le char suivant est non-espace et non-fin.
      const apres = texte[i + 1];
      if (apres === undefined || apres === ' ' || apres === '\t') {
        tampon += '$';
        i += 1;
        continue;
      }
      // Cherche le $ fermant qui n'est pas precede d'un espace.
      let fin = -1;
      let j = i + 1;
      while (j < texte.length) {
        if (texte[j] === '$') {
          // Ferme seulement si le char precedent est non-espace.
          const avant = texte[j - 1];
          if (avant !== ' ' && avant !== '\t') {
            fin = j;
          }
          break;
        }
        j++;
      }
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

/** Decoupe les lignes d'un segment hors-math : paragraphes et listes. */
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

  for (const ligne of texte.split(/\r?\n/)) {
    // Retire un \r residuel (CRLF sur certains OS)
    const l = ligne.endsWith('\r') ? ligne.slice(0, -1) : ligne;
    if (l.trim() === '') { fermerParagraphe(); fermerListe(); continue; }
    if (l.startsWith('- ')) {
      fermerParagraphe();
      liste.push(tokeniserInline(l.slice(2)));
      continue;
    }
    fermerListe();
    paragraphe.push(tokeniserInline(l));
  }
  fermerParagraphe();
  fermerListe();
  return blocs;
}

export function tokeniser(source: string): Bloc[] {
  const blocs: Bloc[] = [];
  let curseur = 0;

  // Extraction des blocs $$...$$ (potentiellement multi-lignes) ;
  // un $$ sans fermant est laisse au tokenizer inline -> litteral.
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
