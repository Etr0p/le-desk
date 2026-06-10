// Build « fichier unique » : tout (JS, CSS, polices KaTeX, chapitres) est
// inliné dans un seul index.html ouvrable en double-clic (file://), sans
// service worker ni réseau. Utilisé par `npm run build:fichier`.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex], providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
    viteSingleFile({ removeViteModuleLoader: true }),
  ],
  build: {
    outDir: 'dist-standalone',
    assetsInlineLimit: 100_000_000, // tout inliner, polices KaTeX comprises
    chunkSizeWarningLimit: 100_000,
  },
});
