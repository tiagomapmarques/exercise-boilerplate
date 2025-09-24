/** biome-ignore-all lint/suspicious/noConsole: Useful as this is a script */

/** Adds red to the background of the text */
export const redBg = (string) => `\x1b[41m${string}\x1b[0m`;

/** Adds yellow to the background of the text */
export const yellowBg = (string) => `\x1b[43m${string}\x1b[0m`;

/** Adds blue to the background of the text */
export const blueBg = (string) => `\x1b[44m${string}\x1b[0m`;

/** Adds red to the foreground of the text */
export const redFg = (string) => `\x1b[31m${string}\x1b[0m`;

/** Adds yellow to the foreground of the text */
export const yellowFg = (string) => `\x1b[33m${string}\x1b[0m`;

/** Adds blue to the foreground of the text */
export const blueFg = (string) => `\x1b[34m${string}\x1b[0m`;

const logCount = { error: 0, warn: 0, info: 0, log: 0 };

/** Gets a copy of the call counters for `error`, `warn` and `log` functions. */
export const getLogCounts = () => ({ ...logCount });

/** Gets whether the `error` function has been called. */
export const hasLoggedError = () => logCount.error > 0;

/** Gets whether the `error` or `warn` functions have been called. */
export const hasLoggedWarnOrError = () => hasLoggedError() || logCount.warn > 0;

/** Gets whether the `error`, `warn` or `info` functions have been called. */
export const hasLoggedInfoWarnOrError = () =>
  hasLoggedWarnOrError() || logCount.info > 0;

/** Gets whether any of the log functions have been called. */
export const hasLoggedAnything = () =>
  hasLoggedInfoWarnOrError() || logCount.log > 0;

/** Logs error to the terminal. */
export const error = (...args) => {
  logCount.error += 1;
  const mappedArgs = args.map((string) => {
    return string.replaceAll('\n', `\n${redBg('▏FAIL▕')} `);
  });

  console.log(redBg('▏FAIL▕'), ...mappedArgs);
};

/** Logs warning to the terminal. */
export const warn = (...args) => {
  logCount.warn += 1;
  const mappedArgs = args.map((string) => {
    return string.replaceAll('\n', `\n${yellowBg('▏WARN▕')} `);
  });

  console.log(yellowBg('▏WARN▕'), ...mappedArgs);
};

/** Logs information to the terminal. */
export const info = (...args) => {
  logCount.info += 1;
  const mappedArgs = args.map((string) => {
    return string.replaceAll('\n', `\n${blueFg('▏INFO▕')} `);
  });

  console.log(blueFg('▏INFO▕'), ...mappedArgs);
};

/** Logs to the terminal. */
export const log = (...args) => {
  logCount.log += 1;
  console.log(...args);
};
