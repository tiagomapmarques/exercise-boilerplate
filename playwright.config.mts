import process from 'node:process';
import { defineConfig, devices } from 'playwright/test';

import {
  type Browser,
  browserList,
  getCliBrowsers,
} from './get-cli-browsers.mts';

const playwrightBrowsers: Record<Browser, (typeof devices)[string]> = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
};

// Headless runs the production build for fidelity, otherwise it runs the Vite dev server.
// biome-ignore lint/style/noProcessEnv: Set by the test:e2e:watch script so all worker processes agree
const isWatch = Boolean(process.env.PLAYWRIGHT_IS_WATCH);

// Pick a random browser once in the main process - workers inherit the env var at spawn time
// biome-ignore lint/style/noProcessEnv: Accessed to make sure all workers match
if (isWatch && !process.env.PLAYWRIGHT_BROWSER) {
  // biome-ignore lint/style/noProcessEnv: Written once by the main process, inherited by workers
  process.env.PLAYWRIGHT_BROWSER =
    browserList[Math.floor(Math.random() * browserList.length)];
}

const baseUrl = `http://localhost:${isWatch ? '5173' : '8080'}`;

// biome-ignore lint/style/noDefaultExport: Required by playwright
export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts?(x)'],
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: baseUrl,
    headless: true,
    trace: 'retain-on-first-failure',
  },
  projects: getCliBrowsers(isWatch).map((browser) => ({
    name: browser,
    ...playwrightBrowsers[browser],
  })),
  webServer: {
    command: isWatch ? 'pnpm start' : 'pnpm build && pnpm serve',
    url: baseUrl,
    // biome-ignore lint/style/noProcessEnv: Conventional signal for CI environments
    reuseExistingServer: !process.env.CI,
  },
});
