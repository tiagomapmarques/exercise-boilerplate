import process from 'node:process';

import { defineConfig } from 'vite';

import viteConfig from './vite.config.mjs';

const browserArgs = process.argv.find((arg) => arg === '--all-browsers')
  ? ['firefox', 'chromium', 'webkit']
  : process.argv
      .filter((arg) => /--(firefox|chromium|webkit)/.test(arg))
      .map((browserArg) => browserArg.slice(2));

const browsers = browserArgs.length > 0 ? browserArgs : ['firefox'];

// biome-ignore lint/style/noDefaultExport: Necessary for it to work
export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    setupFiles: './vitest.setup.mts',
    mockReset: true,
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: browsers.map((browser) => ({ browser })),
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
