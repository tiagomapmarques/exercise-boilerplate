import { lingui } from '@lingui/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react({ plugins: [['@lingui/swc-plugin', {}]] }),
    lingui(),
    tsconfigPaths(),
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
  test: {
    globals: true,
    setupFiles: './vitest.environment.mts',
    mockReset: true,
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**'],
      exclude: [
        'src/components/dev-tools/**',
        'src/routes/**',
        'src/locales/**',
        'src/testing/**',
        'src/*.gen.ts',
        'src/main.tsx',
      ],
    },
  },
});
