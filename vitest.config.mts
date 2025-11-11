import process from 'node:process';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

import viteConfig from './vite.config.mjs';

const browserList = ['chromium', 'firefox', 'webkit'] as const;

const getBrowsers = () => {
  const isWatch = !process.argv.includes('--run');

  const defaultBrowsers = isWatch
    ? [browserList[Math.floor(Math.random() * 10) % browserList.length]]
    : browserList;

  const browserRegex = /^--(chromium|firefox|webkit)$/;
  const argvBrowsers = process.argv
    .filter((arg) => browserRegex.test(arg))
    .map((browser) => browser.slice(2) as (typeof defaultBrowsers)[number]);

  return argvBrowsers.length > 0 ? argvBrowsers : defaultBrowsers;
};

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
      provider: playwright({}),
      instances: getBrowsers().map((browser) => ({ browser })),
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
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
