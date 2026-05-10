import process from 'node:process';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

import viteConfig from './vite.config.mts';

const getBrowsers = () => {
  const isWatch = !process.argv.includes('--run');
  const browserList = ['chromium', 'firefox', 'webkit'] as const;
  const browserRegex = new RegExp(
    `^--(?<browser>${browserList.join('|')})$`,
    'u',
  );

  const defaultBrowsers = isWatch
    ? [browserList[Math.floor(Math.random() * browserList.length)]]
    : browserList;

  const argvBrowsers = process.argv
    .map((arg) => browserRegex.exec(arg)?.groups?.browser)
    .filter((browser): browser is (typeof browserList)[number] =>
      Boolean(browser),
    );

  return argvBrowsers.length > 0 ? argvBrowsers : defaultBrowsers;
};

// biome-ignore lint/style/noDefaultExport: Required by vitest
export default defineConfig({
  ...viteConfig,
  test: {
    include: ['**/*.test.ts?(x)'],
    setupFiles: './vitest.setup.mts',
    globals: true,
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
