import { blueFg, redFg, yellowFg } from './logs.mjs';

const semverSize = 3;

/** Parses a stringified semver into its major, minor and patch versions. */
export const parseSemver = (semver, round, digits = 6) => {
  const prefix = [...new Array(digits)].reduce((index) => `${index}0`, '');
  const exponentialMajorOrDefault = round === 'major' ? 2 : 0;
  const exponential = round === 'minor' ? 1 : exponentialMajorOrDefault;

  const semverSplit = semver.split('.').map((value) => value.split('-')[0]);
  const semverParsed = [...new Array(semverSize)].map(
    (_, index) => `${semverSplit[index] || 0}`,
  );

  const number =
    Number(
      semverParsed
        .map((value = '0') => `${prefix}${value}`.slice(-digits))
        .join(''),
    ) /
    10 ** (digits * exponential);

  const safeNumber = `${prefix}${number}`;

  const major = Number(safeNumber.slice(0, -digits * 2));
  const minor = Number(safeNumber.slice(-digits * 2).slice(0, digits));
  const patch = Number(safeNumber.slice(-digits));

  return { number, major, minor, patch };
};

/** Transforms a parsed semver to a colored string. */
const semverToLog = (
  { major, minor, patch },
  highlight,
  highlightEnd = false,
) => {
  if (highlight === 'major') {
    const suffix = `.${minor}.${patch}`;
    return `${redFg(major)}${highlightEnd ? redFg(suffix) : suffix}`;
  }

  if (highlight === 'minor') {
    const suffix = `.${patch}`;
    return `${major}.${yellowFg(minor)}${highlightEnd ? yellowFg(suffix) : suffix}`;
  }

  if (highlight === 'patch') {
    return `${major}.${minor}.${blueFg(patch)}`;
  }

  return `${major}.${minor}.${patch}`;
};

/** Compares 2 parsed semver and returns the first one highlighted if its is an updated version. */
export const highlightSemver = (latest, current) => {
  if (latest.major > current.major) {
    return semverToLog(latest, 'major');
  }
  if (latest.minor > current.minor) {
    return semverToLog(latest, 'minor');
  }
  if (latest.patch > current.patch) {
    return semverToLog(latest, 'patch');
  }
  return `${latest.major}.${latest.minor}.${latest.patch}`;
};
