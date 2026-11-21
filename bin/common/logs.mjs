/** Wraps text with a red background. */
export const redBackground = (string) => `\x1b[41m${string}\x1b[0m`;

/** Wraps text with a yellow background. */
const yellowBackground = (string) => `\x1b[43m${string}\x1b[0m`;

/** Wraps text with red foreground. */
export const redForeground = (string) => `\x1b[31m${string}\x1b[0m`;

/** Wraps text with yellow foreground. */
export const yellowForeground = (string) => `\x1b[33m${string}\x1b[0m`;

/** Wraps text with blue foreground. */
export const blueForeground = (string) => `\x1b[34m${string}\x1b[0m`;

const writeLine = (stream, prefix, args) => {
  const body = args
    .map((value) => String(value).replaceAll('\n', `\n${prefix}`))
    .join(' ');

  stream.write(`${prefix}${body}\n`);
};

/** Logs a string to `stderr` with a red `[FAIL]` prefix. */
export const logError = (...args) => {
  writeLine(process.stderr, `${redBackground('[FAIL]')} `, args);
};

/** Logs a string to `stderr` with a yellow `[WARN]` prefix. */
export const logWarning = (...args) => {
  writeLine(process.stderr, `${yellowBackground('[WARN]')} `, args);
};

/** Logs a string to `stdout` with a blue `[INFO]` prefix. */
export const logInfo = (...args) => {
  writeLine(process.stdout, `${blueForeground('[INFO]')} `, args);
};

/** Logs a string to `stdout` without a prefix. */
export const log = (...args) => {
  writeLine(process.stdout, '', args);
};
