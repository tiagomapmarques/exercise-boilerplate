/** List of browser names supported by Playwright. */
export const browserList = ['chromium', 'firefox', 'webkit'] as const;
const browserArgRegex = new RegExp(
  `^--(?<browser>${browserList.join('|')})$`,
  'u',
);

/** A browser supported by Playwright. */
export type Browser = (typeof browserList)[number];

/** Narrows an arbitrary string to a `Browser`, or returns undefined. */
export const toBrowser = (browser: string | undefined): Browser | undefined => {
  return browser && browserList.includes(browser as Browser)
    ? (browser as Browser)
    : undefined;
};

/** Returns a random browser from the supported list. */
export const getRandomBrowser = () => {
  return browserList[Math.floor(Math.random() * browserList.length)];
};

/** Returns the list of browsers to run, based on CLI args and whether watch mode is active. */
export const resolveBrowsers = (isWatch: boolean, browser?: Browser) => {
  const argvBrowsers = process.argv
    // biome-ignore lint/suspicious/noUnnecessaryConditions: False positive - exec can be null and groups undefined
    .map((arg) => toBrowser(browserArgRegex.exec(arg)?.groups?.browser))
    .filter((arg): arg is Browser => Boolean(arg));

  const lastArgvBrowser = argvBrowsers.at(-1);

  if (!lastArgvBrowser) {
    return isWatch ? [browser ?? getRandomBrowser()] : [...browserList];
  }
  return isWatch ? [lastArgvBrowser] : argvBrowsers;
};
