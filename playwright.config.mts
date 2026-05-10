import process from 'node:process';
import { defineConfig, devices } from 'playwright/test';

const getBrowsers = () => {
  const isWatch = process.argv.includes('--ui');
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

const playwrightBrowsers: Record<
  ReturnType<typeof getBrowsers>[number],
  (typeof devices)[string]
> = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
};

// biome-ignore lint/style/noDefaultExport: Required by playwright
export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts?(x)'],
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    trace: 'on-all-retries',
  },
  projects: getBrowsers().map((browser) => ({
    name: browser,
    ...playwrightBrowsers[browser],
  })),
  webServer: {
    command: 'pnpm build && pnpm serve',
    url: 'http://localhost:8080',
  },
});
