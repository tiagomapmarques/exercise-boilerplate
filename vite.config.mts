import process from 'node:process';
import { lingui } from '@lingui/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { countries } from './src/providers/locale/constants';

const devtools =
  // biome-ignore lint/style/noProcessEnv: Accessed at build-time only
  process.env.NODE_ENV === 'development'
    ? (await import('@tanstack/devtools-vite')).devtools
    : undefined;

// biome-ignore lint/style/noDefaultExport: Necessary for it to work
export default defineConfig({
  plugins: [
    devtools?.(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    lingui(),
    react({ plugins: [['@lingui/swc-plugin', {}]] }),
    viteStaticCopy({
      targets: countries.map((country) => ({
        src: `./node_modules/country-flag-icons/1x1/${country}.svg`,
        dest: 'flags',
        rename: { stripBase: true },
      })),
    }),
    legacy({
      modernTargets: 'defaults',
      modernPolyfills: true,
      renderLegacyChunks: false,
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/react(?:-dom)?\//u.test(id)) {
            return 'vendor';
          }
        },
      },
    },
  },
});
