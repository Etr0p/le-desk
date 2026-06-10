/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex], providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Le Desk — Finance de marché',
        short_name: 'Le Desk',
        description: 'Cours complet de finance de marché, exercices paramétrés, hors ligne.',
        theme_color: '#0c1118',
        background_color: '#0c1118',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
