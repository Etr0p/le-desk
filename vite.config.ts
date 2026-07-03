/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex], providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Plafond de précache PAR FICHIER (défaut 2 Mio) : relevé à 12 Mio au m11
      // (bundle monolithique à 8,44 Mo). Depuis le m5, les banques sont
      // découpées en un chunk par module (build.rolldownOptions ci-dessous) —
      // le plafond est conservé par sécurité mais plus aucun fichier ne
      // devrait l'approcher.
      workbox: { maximumFileSizeToCacheInBytes: 12 * 1024 * 1024 },
      manifest: {
        name: 'Le Desk — Finance de marché',
        short_name: 'Le Desk',
        description: 'Cours complet de finance de marché, exercices paramétrés, hors ligne.',
        theme_color: '#0c1118',
        background_color: '#0c1118',
        display: 'standalone',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build: {
    rolldownOptions: {
      output: {
        // Un chunk par module de contenu (banques : exercices, problèmes, qcm,
        // jury, flashcards, formules, calculs) pour rester loin du plafond de
        // précache PWA par fichier. Les chapitres MDX gardent leurs chunks
        // paresseux (import() dans chapters.ts) — on ne les regroupe pas.
        advancedChunks: {
          groups: [
            {
              name: (id: string) => {
                const chemin = id.replace(/\\/g, '/');
                if (chemin.endsWith('.mdx') || chemin.includes('/chapters/')) return undefined;
                if (chemin.includes('/src/content/glossary')) return 'glossaire';
                const m = /\/src\/content\/modules\/([^/]+)\//.exec(chemin);
                return m ? `banque-${m[1]}` : undefined;
              },
            },
          ],
        },
      },
    },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
