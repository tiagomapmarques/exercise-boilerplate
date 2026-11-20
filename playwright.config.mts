import process from 'node:process';
import { defineConfig } from 'playwright/test';

import {
  getRandomBrowser,
  playwrightBrowsers,
  resolveBrowsers,
  toBrowser,
} from './browsers.mts';
import viteConfig from './vite.config.mts';

// The --ui flag only reaches the main process. The watch state needs to be
// propagated to the workers and a single browser needs to be pinned otherwise
// workers will spawn different random browsers.
if (process.argv.includes('--ui')) {
  process.env.PLAYWRIGHT_IS_WATCH = '1';
  process.env.PLAYWRIGHT_BROWSER ??= getRandomBrowser();
}

const isWatch = Boolean(process.env.PLAYWRIGHT_IS_WATCH);
const requestedBrowser = toBrowser(process.env.PLAYWRIGHT_BROWSER);

const baseUrl = `http://localhost:${isWatch ? '5173' : '8080'}${viteConfig.base}`;

// biome-ignore lint/style/noDefaultExport: Required by playwright
export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts?(x)'],
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: baseUrl,
    testIdAttribute: 'data-slot',
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
