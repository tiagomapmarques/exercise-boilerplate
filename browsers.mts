import { devices } from 'playwright/test';

export const playwrightBrowsers = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
} as const;

/** A browser supported by Playwright. */
export type Browser = keyof typeof playwrightBrowsers;

const isBrowser = (browser: string): browser is Browser =>
  browser in playwrightBrowsers;

/** List of browser names supported by Playwright. */
const browserList = Object.keys(playwrightBrowsers).filter(isBrowser);
const browserArgRegex = new RegExp(
  `^--(?<browser>${browserList.join('|')})$`,
  'u',
);

/** Narrows an arbitrary string to a `Browser`, or returns undefined. */
export const toBrowser = (browser: string | undefined): Browser | undefined => {
  return browser && isBrowser(browser) ? browser : undefined;
};

/** Returns a random browser from the supported list. */
export const getRandomBrowser = () => {
  return browserList[Math.floor(Math.random() * browserList.length)];
};

/** Returns the list of browsers to run, based on CLI args and whether watch mode is active. */
export const resolveBrowsers = (isWatch: boolean, browser?: Browser) => {
  const argvBrowsers = process.argv
    .map((arg) => toBrowser(browserArgRegex.exec(arg)?.groups?.browser))
    .filter((candidate): candidate is Browser => Boolean(candidate));

  const lastArgvBrowser = argvBrowsers.at(-1);

  if (!lastArgvBrowser) {
    return isWatch ? [browser ?? getRandomBrowser()] : [...browserList];
  }
  return isWatch ? [lastArgvBrowser] : argvBrowsers;
};
