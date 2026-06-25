import { blueFg, redFg, yellowFg } from './logs.mjs';

const stripRangeRegex = /^[~^>=<]*/u;

/** Strips surrounding whitespace and any leading range operator (`^`, `~`, `>`, `<`, `=`) from a version. */
export const stripRangePrefix = (version) => {
  return (version ?? '').trim().replace(stripRangeRegex, '');
};

/** Parses a semver string, capturing any trailing `-prerelease`/`+build` info. */
export const parseSemver = (semver) => {
  const semverParsed = semver ?? '';
  const [major = 0, minor = 0, patch = 0] = semverParsed
    .split('.')
    .map((segment) => Number.parseInt(segment, 10) || 0);

  const reassembled = `${major}.${minor}.${patch}`;
  const patchInfo = semverParsed.startsWith(reassembled)
    ? semverParsed.slice(reassembled.length)
    : '';

  return { major, minor, patch, patchInfo };
};

/** Reduces a version to `major.minor.0`, dropping patch and prerelease info. */
export const removePatch = (version) => {
  if (!version) {
    return version;
  }
  const { major, minor } = parseSemver(version);
  return `${major}.${minor}.0`;
};

/** Compares two parsed semvers, returning a negative, zero, or positive number. */
export const compareSemver = (left, right) => {
  if (left.major !== right.major) {
    return left.major - right.major;
  }
  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }
  if (left.patch !== right.patch) {
    return left.patch - right.patch;
  }
  if (left.patchInfo === right.patchInfo) {
    return 0;
  }
  if (left.patchInfo === '') {
    return 1;
  }
  if (right.patchInfo === '') {
    return -1;
  }
  // Known limitation: this only compares strings and is not semver §11
  // compliant (e.g. `-alpha.10` would sort below `-alpha.2`).
  return left.patchInfo > right.patchInfo ? 1 : -1;
};

/** Renders `latest` with the highlighted segment that exceeds `current`. */
export const highlightSemver = (latest, current) => {
  const { major, minor, patch, patchInfo } = latest;

  if (major > current.major) {
    return `${redFg(major)}.${minor}.${patch}${patchInfo}`;
  }
  if (minor > current.minor) {
    // A 0.x release is unstable, so flag a minor change as severely as a major one.
    const color = major === 0 ? redFg : yellowFg;
    return `${major}.${color(minor)}.${patch}${patchInfo}`;
  }
  if (patch > current.patch) {
    // A 0.x release is unstable, so flag a patch change as severely as a minor one.
    const color = major === 0 ? yellowFg : blueFg;
    return `${major}.${minor}.${color(patch)}${patchInfo}`;
  }
  if (patchInfo !== current.patchInfo) {
    return `${major}.${minor}.${patch}${blueFg(patchInfo)}`;
  }
  return `${major}.${minor}.${patch}${patchInfo}`;
};
