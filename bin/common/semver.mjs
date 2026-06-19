import { blueFg, redFg, yellowFg } from './logs.mjs';

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

  if (latest.major > current.major) {
    return `${redFg(major)}.${minor}.${patch}${patchInfo}`;
  }
  if (latest.minor > current.minor) {
    return `${major}.${yellowFg(minor)}.${patch}${patchInfo}`;
  }
  if (latest.patch > current.patch) {
    return `${major}.${minor}.${blueFg(patch)}${patchInfo}`;
  }
  if (latest.patchInfo !== current.patchInfo) {
    return `${major}.${minor}.${patch}${blueFg(patchInfo)}`;
  }
  return `${major}.${minor}.${patch}${patchInfo}`;
};
