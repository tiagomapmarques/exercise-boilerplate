import process from 'node:process';

/** List of browser names supported by Playwright. */
export const browserList = ['chromium', 'firefox', 'webkit'] as const;

/** A browser supported by Playwright. */
export type Browser = (typeof browserList)[number];

/** Returns the list of browsers to run, based on CLI args and whether watch mode is active. */
export const getCliBrowsers = (isWatch: boolean) => {
  const browserRegex = new RegExp(
    `^--(?<browser>${browserList.join('|')})$`,
    'u',
  );

  // biome-ignore lint/style/noProcessEnv: Set by playwright.config.mts before workers spawn
  const playwrightBrowser = process.env.PLAYWRIGHT_BROWSER as
    | Browser
    | undefined;
  const randomBrowser =
    browserList[Math.floor(Math.random() * browserList.length)];

  const defaultBrowsers = isWatch
    ? [playwrightBrowser ?? randomBrowser]
    : browserList;

  const argvBrowsers = process.argv
    .map((arg) => browserRegex.exec(arg)?.groups?.browser)
    .filter((browser): browser is Browser => Boolean(browser));

  return argvBrowsers.length > 0 ? argvBrowsers : defaultBrowsers;
};
