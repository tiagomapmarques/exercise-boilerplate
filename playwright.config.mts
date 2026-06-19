import process from 'node:process';
import { defineConfig, devices } from 'playwright/test';

import {
  type Browser,
  getRandomBrowser,
  resolveBrowsers,
  toBrowser,
} from './browsers.mts';

const playwrightBrowsers: Record<Browser, (typeof devices)[string]> = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
};

// The --ui flag only reaches the main process. The watch state needs to be
// propagated to the workers and a single browser needs to be pinned otherwise
// workers will spawn different random browsers.
if (process.argv.includes('--ui')) {
  process.env.PLAYWRIGHT_IS_WATCH = '1';
  process.env.PLAYWRIGHT_BROWSER ??= getRandomBrowser();
}

const isWatch = Boolean(process.env.PLAYWRIGHT_IS_WATCH);
const requestedBrowser = toBrowser(process.env.PLAYWRIGHT_BROWSER);

const baseUrl = `http://localhost:${isWatch ? '5173' : '8080'}`;

// biome-ignore lint/style/noDefaultExport: Required by playwright
export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts?(x)'],
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // biome-ignore lint/style/useNamingConvention: Defined by playwright
    baseURL: baseUrl,
    headless: true,
    trace: 'retain-on-first-failure',
  },
  projects: resolveBrowsers(isWatch, requestedBrowser).map((browser) => ({
    name: browser,
    ...playwrightBrowsers[browser],
  })),
  webServer: {
    command: isWatch ? 'pnpm start' : 'pnpm build && pnpm serve',
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
