import { Fragment, useMemo } from 'react';
import { MathBlock, MathInline } from './Math';
import { tokeniser, type Inline } from './markdown-parser';

function RenduInline({ tokens }: { tokens: Inline[] }) {
  return (
    <>
      {tokens.map((t, i) => {
        switch (t.type) {
          case 'texte':
            return <Fragment key={i}>{t.valeur}</Fragment>;
          case 'gras':
            return (
              <strong key={i} className="font-semibold text-text">
                <RenduInline tokens={t.enfants} />
              </strong>
            );
          case 'italique':
            return (
              <em key={i}>
                <RenduInline tokens={t.enfants} />
              </em>
            );
          case 'math':
            return <MathInline key={i} tex={t.tex} />;
        }
      })}
    </>
  );
}

/** Rendu des chaînes générées (énoncés, corrigés) — pas un moteur Markdown complet. */
export function Markdown({ texte, className }: { texte: string; className?: string }) {
  const blocs = useMemo(() => tokeniser(texte), [texte]);
  return (
    <div className={className}>
      {blocs.map((b, i) => {
        switch (b.type) {
          case 'paragraphe':
            return (
              <p key={i} className="my-2 leading-relaxed first:mt-0 last:mb-0">
                {b.lignes.map((ligne, j) => (
                  <Fragment key={j}>
                    {j > 0 && <br />}
                    <RenduInline tokens={ligne} />
                  </Fragment>
                ))}
              </p>
            );
          case 'liste':
            return (
              <ul key={i} className="my-2 list-disc space-y-1 pl-5 leading-relaxed marker:text-text-muted first:mt-0 last:mb-0">
                {b.elements.map((el, j) => (
                  <li key={j}>
                    <RenduInline tokens={el} />
                  </li>
                ))}
              </ul>
            );
          case 'mathBloc':
            return <MathBlock key={i} tex={b.tex} />;
        }
      })}
    </div>
  );
}
