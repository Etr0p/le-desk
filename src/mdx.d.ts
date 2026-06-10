declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const meta: { id: string; titre: string; ordre: number };
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
