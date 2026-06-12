#!/usr/bin/env node
import { exec as execCallback } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { promisify } from 'node:util';

import { error, info, log, redBg, warn } from './common/logs.mjs';
import {
  compareSemver,
  highlightSemver,
  parseSemver,
} from './common/semver.mjs';

const execPromise = promisify(execCallback);

const projectRoot = `${import.meta.dirname}/..`;
const errorOnWarnings = process.argv.includes('--error-on-warnings');
const unknownVersion = 'UNKNOWN';
const fetchTimeout = 5000;

const fetchJson = async (url) => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(fetchTimeout),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${url}`);
  }
  return response.json();
};

const fetchNodeRelease = async () => {
  const releases = await fetchJson(
    'https://nodejs.org/download/release/index.json',
  );

  return {
    latest: releases.find((release) => !release.lts)?.version.slice(1),
    lts: releases.find((release) => release.lts)?.version.slice(1),
  };
};

const fetchPnpmRelease = async () => {
  const { stdout } = await execPromise('pnpm config get registry');
  const registry = stdout.trim();
  const { 'dist-tags': distTags } = await fetchJson(`${registry}/pnpm`);

  return distTags.latest;
};

const fetchAlpineRelease = async () => {
  const { results } = await fetchJson(
    'https://registry.hub.docker.com/v2/repositories/library/alpine/tags?page_size=100',
  );
  const stableTagPattern = /^\d+\.\d+\.\d+$/u;
  const versions = results
    .map((tag) => tag.name)
    .filter((name) => stableTagPattern.test(name));

  return versions.reduce(
    (highest, current) =>
      compareSemver(parseSemver(current), parseSemver(highest)) > 0
        ? current
        : highest,
    unknownVersion,
  );
};

const stripRangePrefix = (version) => version.trim().replace(/^[~^>=<]*/u, '');
const readDockerArg = (content, name) =>
  content.match(new RegExp(`ARG ${name}=(.+)`, 'u'))?.[1];

const readPackageJson = () => {
  const { engines, devDependencies } = JSON.parse(
    readFileSync(`${projectRoot}/package.json`).toString(),
  );
  const [nodeLts, nodeLatest] = engines.node.split('||').map(stripRangePrefix);

  return {
    node: { latest: nodeLatest, lts: nodeLts },
    pnpm: stripRangePrefix(engines.pnpm),
    playwright: stripRangePrefix(devDependencies.playwright),
  };
};

const readDockerArgs = (file) => {
  const content = readFileSync(file).toString();

  return {
    node: readDockerArg(content, 'NODE_VERSION'),
    pnpm: readDockerArg(content, 'PNPM_VERSION'),
    playwright: readDockerArg(content, 'PLAYWRIGHT_VERSION'),
    alpine: readDockerArg(content, 'ALPINE_VERSION'),
  };
};

const issues = { info: 0, warn: 0, error: 0 };

const checkConsistency = ({ name, current = unknownVersion, matches }) => {
  if (current === matches) {
    return;
  }

  error(
    `\nCurrent version of ${name} is ${redBg(current)}, expected ${matches}.\n`,
  );
  issues.error += 1;
};

const checkForUpdate = ({
  name,
  current = unknownVersion,
  latest,
  severity,
}) => {
  const currentParsed = parseSemver(current);
  const latestParsed = parseSemver(latest);
  const ordering = compareSemver(latestParsed, currentParsed);

  if (ordering === 0) {
    return;
  }

  if (ordering < 0) {
    error(
      `\nCurrent version of ${name} (${redBg(current)}) is invalid/unknown.\n`,
    );
    issues.error += 1;
    return;
  }

  const highlight = highlightSemver(latestParsed, currentParsed);
  const message = `Update ${name} to ${highlight} (current: ${current})`;

  if (severity === 'error' || (severity === 'warn' && errorOnWarnings)) {
    error(message);
    issues.error += 1;
  } else if (severity === 'warn') {
    warn(message);
    issues.warn += 1;
  } else {
    info(message);
    issues.info += 1;
  }
};

const [nodeRelease, pnpmRelease, alpineRelease] = await Promise.all([
  fetchNodeRelease(),
  fetchPnpmRelease(),
  fetchAlpineRelease(),
]);

const internet = {
  node: nodeRelease,
  pnpm: pnpmRelease,
  alpine: alpineRelease,
};
const packageJson = readPackageJson();
const docker = readDockerArgs(`${projectRoot}/Dockerfile`);
const dockerCi = readDockerArgs(`${projectRoot}/Dockerfile.ci`);
const nodeVersionFile = readFileSync(`${projectRoot}/.node-version`)
  .toString()
  .trim()
  .slice(1);

const internetChecks = [
  {
    name: 'node LTS',
    current: packageJson.node.lts,
    latest: internet.node.lts,
    severity: 'warn',
  },
  {
    name: 'node',
    current: packageJson.node.latest,
    latest: internet.node.latest,
    severity: 'info',
  },
  {
    name: 'pnpm',
    current: packageJson.pnpm,
    latest: internet.pnpm,
    severity: 'info',
  },
  {
    name: 'alpine (Dockerfile)',
    current: docker.alpine,
    latest: internet.alpine,
    severity: 'info',
  },
  {
    name: 'alpine (Dockerfile.ci)',
    current: dockerCi.alpine,
    latest: internet.alpine,
    severity: 'info',
  },
];

const consistencyChecks = [
  {
    name: 'node (Dockerfile)',
    current: docker.node,
    matches: packageJson.node.lts,
  },
  {
    name: 'pnpm (Dockerfile)',
    current: docker.pnpm,
    matches: packageJson.pnpm,
  },
  {
    name: 'node (Dockerfile.ci)',
    current: dockerCi.node,
    matches: packageJson.node.lts,
  },
  {
    name: 'pnpm (Dockerfile.ci)',
    current: dockerCi.pnpm,
    matches: packageJson.pnpm,
  },
  {
    name: 'playwright (Dockerfile.ci)',
    current: dockerCi.playwright,
    matches: packageJson.playwright,
  },
  {
    name: 'alpine (Dockerfile.ci)',
    current: dockerCi.alpine,
    matches: docker.alpine,
  },
  {
    name: 'node (.node-version)',
    current: nodeVersionFile,
    matches: packageJson.node.lts,
  },
];

for (const check of internetChecks) {
  checkForUpdate(check);
}

if (issues.warn === 0 && issues.error === 0) {
  for (const check of consistencyChecks) {
    checkConsistency(check);
  }
}

if (issues.info === 0 && issues.warn === 0 && issues.error === 0) {
  log('No engine updates found');
}

if (issues.error > 0) {
  process.exit(1);
}
