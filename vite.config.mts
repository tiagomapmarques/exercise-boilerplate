import process from 'node:process';
import { lingui } from '@lingui/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Intentional import to avoid pulling in the full locale module at build time
import { countries } from './src/providers/locale/constants';
import { deferRenderBlocking } from './vite-plugin-defer-render-blocking.mts';

// Long-lived foundational dependencies bundled into a stable vendor chunk -
// they change rarely, improving cache hit rate. Mantine is intentionally
// excluded so each route only pays for the components it uses.
const vendorPathPrefixes = [
  '/node_modules/react/',
  '/node_modules/react-dom/',
  '/node_modules/@lingui/',
  '/node_modules/@tanstack/react-router/',
];

const devtools =
  process.env.NODE_ENV === 'development'
    ? (await import('@tanstack/devtools-vite')).devtools
    : undefined;

// biome-ignore lint/style/noDefaultExport: Required by vite
export default defineConfig({
  plugins: [
    devtools?.(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
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
    deferRenderBlocking(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (vendorPathPrefixes.some((path) => id.includes(path))) {
            return 'vendor';
          }
        },
      },
    },
  },
});
