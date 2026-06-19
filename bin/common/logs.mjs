/** Wraps text with a red background. */
export const redBg = (string) => `\x1b[41m${string}\x1b[0m`;

/** Wraps text with a yellow background. */
export const yellowBg = (string) => `\x1b[43m${string}\x1b[0m`;

/** Wraps text with a blue background. */
export const blueBg = (string) => `\x1b[44m${string}\x1b[0m`;

/** Wraps text with red foreground. */
export const redFg = (string) => `\x1b[31m${string}\x1b[0m`;

/** Wraps text with yellow foreground. */
export const yellowFg = (string) => `\x1b[33m${string}\x1b[0m`;

/** Wraps text with blue foreground. */
export const blueFg = (string) => `\x1b[34m${string}\x1b[0m`;

const writeLine = (stream, prefix, args) => {
  const body = args
    .map((value) => String(value).replaceAll('\n', `\n${prefix}`))
    .join(' ');

  stream.write(`${prefix}${body}\n`);
};

/** Logs a string to `stderr` with a red `[FAIL]` prefix. */
export const error = (...args) => {
  writeLine(process.stderr, `${redBg('[FAIL]')} `, args);
};

/** Loga a string to `stderr` with a yellow `[WARN]` prefix. */
export const warn = (...args) => {
  writeLine(process.stderr, `${yellowBg('[WARN]')} `, args);
};

/** Logs a string to `stdout` with a blue `[INFO]` prefix. */
export const info = (...args) => {
  writeLine(process.stdout, `${blueFg('[INFO]')} `, args);
};

/** Logs a string to `stdout` without a prefix. */
export const log = (...args) => {
  writeLine(process.stdout, '', args);
};
