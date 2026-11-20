import process from 'node:process';
import { lingui } from '@lingui/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Intentional import to avoid pulling in the full locale module at build time
import { countries } from './src/providers/locale/constants.mts';

const devtools =
  process.env.NODE_ENV === 'development'
    ? (await import('@tanstack/devtools-vite')).devtools
    : undefined;

const environment = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  'VITE_',
);

const viteBasePath = environment.VITE_BASE_PATH || '/';
const basePath = viteBasePath.endsWith('/') ? viteBasePath : `${viteBasePath}/`;

// Long-lived foundational dependencies bundled into a stable vendor chunk -
// they change rarely, improving cache hit rate. Mantine is intentionally
// excluded so each route chunk holds only the Mantine components it uses.
const vendorPathPrefixes = [
  '/node_modules/react/',
  '/node_modules/react-dom/',
  '/node_modules/@lingui/',
  '/node_modules/@tanstack/react-router/',
];

// biome-ignore lint/style/noDefaultExport: Required by vite
export default defineConfig({
  base: basePath,
  plugins: [
    devtools?.(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    lingui(),
    react(),
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
          if (vendorPathPrefixes.some((path) => id.includes(path))) {
            return 'vendor';
          }
        },
      },
    },
  },
});
