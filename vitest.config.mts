import process from 'node:process';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

import { resolveBrowsers } from './browsers.mts';
import viteConfig from './vite.config.mts';

const isWatch = !process.argv.includes('--run');

// biome-ignore lint/style/noDefaultExport: Required by vitest
export default defineConfig({
  ...viteConfig,
  test: {
    include: ['**/*.test.ts?(x)'],
    setupFiles: ['./vitest.setup.mts'],
    globals: true,
    mockReset: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: resolveBrowsers(isWatch).map((browser) => ({ browser })),
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/components/dev-tools/**',
        'src/routes/**',
        'src/locales/**',
        'src/testing/**',
        'src/*.gen.ts',
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
