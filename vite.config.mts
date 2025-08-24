import { lingui } from '@lingui/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

import { countries } from './src/components/locale-provider/constants';

export default defineConfig({
  plugins: [
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
