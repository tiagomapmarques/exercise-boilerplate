import process from 'node:process';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

import { resolveBrowsers } from './browsers.mts';
import { fallbackLocale } from './src/providers/locale/constants.mts';
import viteConfig from './vite.config.mts';

const isWatch = !process.argv.includes('--run');

// biome-ignore lint/style/noDefaultExport: Required by vitest
export default defineConfig({
  ...viteConfig,
  optimizeDeps: {
    // Prevents page reloads during a test run
    include: ['react-dom/client'],
  },
  test: {
    include: ['**/*.test.ts?(x)'],
    setupFiles: ['./vitest.setup.mts'],
    globals: true,
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ contextOptions: { locale: fallbackLocale } }),
      instances: resolveBrowsers(isWatch).map((browser) => ({ browser })),
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx,mts}'],
      exclude: [
        'src/components/dev-tools/**',
        'src/routes/**',
        'src/testing/**',
        'src/**/*.gen.*',
        'src/main.tsx',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
