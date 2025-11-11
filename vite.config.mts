import process from 'node:process';
import { lingui } from '@lingui/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

import { countries } from './src/providers/locale/constants';

const devtools =
  process.env.NODE_ENV !== 'development'
    ? undefined
    : (await import('@tanstack/devtools-vite')).devtools;

// biome-ignore lint/style/noDefaultExport: Necessary for it to work
export default defineConfig({
  plugins: [
    devtools?.(),
    tsconfigPaths(),
    react({ plugins: [['@lingui/swc-plugin', {}]] }),
    lingui(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteStaticCopy({
      targets: countries.map((country) => ({
        src: `./node_modules/country-flag-icons/1x1/${country}.svg`,
        dest: 'flags',
      })),
    }),
    legacy({
      modernTargets: 'defaults',
      modernPolyfills: true,
      renderLegacyChunks: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/react(?:-dom)?\//.test(id)) {
            return 'vendor';
          }
        },
      },
    },
  },
});
