import katex from 'katex';

/** Rendu KaTeX hors MDX, pour le contenu généré (énoncés, corrigés). */
export function MathInline({ tex }: { tex: string }) {
  return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: false }) }} />;
}

export function MathBlock({ tex }: { tex: string }) {
  return (
    <div
      className="my-3 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { displayMode: true, throwOnError: false }) }}
    />
  );
}
