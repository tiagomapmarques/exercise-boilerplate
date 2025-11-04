import process from 'node:process';

import { defineConfig } from 'vite';

import viteConfig from './vite.config.mjs';

const getBrowsers = () => {
  const browserList = ['chromium', 'firefox', 'webkit'];
  const browserRegex = /^--(chromium|firefox|webkit)$/;
  const argvBrowsers = process.argv.filter(
    (arg) => arg === '--all-browsers' || browserRegex.test(arg),
  );
  const allBrowsersIndex = argvBrowsers.lastIndexOf('--all-browsers');

  const browsers =
    allBrowsersIndex < 0
      ? [browserList[Math.floor(Math.random() * 10) % browserList.length]]
      : browserList;

  const browserOverrides = argvBrowsers.slice(
    allBrowsersIndex >= 0 ? allBrowsersIndex + 1 : 0,
  );

  return browserOverrides.length > 0
    ? browserOverrides.map((browser) => browser.slice(2))
    : browsers;
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
      provider: 'playwright',
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
