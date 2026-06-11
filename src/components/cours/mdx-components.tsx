import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Callout } from './Callout';
import { GoFurther } from './GoFurther';
import { Checkpoint } from './Checkpoint';
import { YieldCurveExplorer } from '../charts/YieldCurveExplorer';
import { DurationConvexityViz } from '../charts/DurationConvexityViz';
import { NormalExplorer } from '../charts/NormalExplorer';
import { MonteCarloViz } from '../charts/MonteCarloViz';
import { OrderBookSim } from '../charts/OrderBookSim';
import { GordonExplorer } from '../charts/GordonExplorer';
import { IndexWeights } from '../charts/IndexWeights';

/* ── Éléments de prose ─────────────────────────────────────────────────
   Cohérents avec le design system : rythme vertical confortable,
   largeur de lecture optimale (~70ch), couleurs des tokens.          */

function H2({ children, ...props }: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className="mt-10 mb-4 border-b border-border pb-2 text-lg font-semibold tracking-tight text-text"
      {...props}
    >
      {children}
    </h2>
  );
}

function H3({ children, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className="mt-7 mb-3 text-base font-semibold text-text"
      {...props}
    >
      {children}
    </h3>
  );
}

function P({ children, ...props }: ComponentPropsWithoutRef<'p'>) {
  return (
    <p className="my-4 text-sm leading-7 text-text" {...props}>
      {children}
    </p>
  );
}

function Ul({ children, ...props }: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul className="my-4 list-disc space-y-1.5 pl-5 text-sm leading-7 text-text" {...props}>
      {children}
    </ul>
  );
}

function Ol({ children, ...props }: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol className="my-4 list-decimal space-y-1.5 pl-5 text-sm leading-7 text-text" {...props}>
      {children}
    </ol>
  );
}

function Li({ children, ...props }: ComponentPropsWithoutRef<'li'>) {
  return (
    <li className="leading-7 marker:text-text-muted" {...props}>
      {children}
    </li>
  );
}

function Blockquote({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      className="my-5 border-l-[3px] border-l-text-muted/30 pl-4 text-sm italic leading-7 text-text-muted"
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Strong({ children, ...props }: ComponentPropsWithoutRef<'strong'>) {
  return (
    <strong className="font-semibold text-text" {...props}>
      {children}
    </strong>
  );
}

function A({ children, href, ...props }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      href={href}
      className="text-accent underline underline-offset-2 transition-colors duration-150 hover:text-accent/80"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function Hr(props: ComponentPropsWithoutRef<'hr'>) {
  return <hr className="my-8 border-border" {...props} />;
}

function Code({ children, ...props }: ComponentPropsWithoutRef<'code'>) {
  return (
    <code
      className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-text"
      {...props}
    >
      {children}
    </code>
  );
}

function Table({ children, ...props }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

function Thead({ children, ...props }: ComponentPropsWithoutRef<'thead'>) {
  return (
    <thead className="border-b border-border bg-surface-2" {...props}>
      {children}
    </thead>
  );
}

function Th({ children, ...props }: ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-text-muted"
      {...props}
    >
      {children}
    </th>
  );
}

function Td({ children, ...props }: ComponentPropsWithoutRef<'td'>) {
  return (
    <td
      className="border-t border-border px-4 py-2.5 leading-relaxed text-text"
      {...props}
    >
      {children}
    </td>
  );
}

/* ── Export ─────────────────────────────────────────────────────────── */

export const composantsMdx: MDXComponents = {
  // Cours-specific
  Callout,
  GoFurther,
  Checkpoint,
  YieldCurveExplorer,
  DurationConvexityViz,
  NormalExplorer,
  MonteCarloViz,
  OrderBookSim,
  GordonExplorer,
  IndexWeights,
  // Prose
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  strong: Strong,
  a: A,
  hr: Hr,
  code: Code,
  table: Table,
  thead: Thead,
  th: Th,
  td: Td,
};
