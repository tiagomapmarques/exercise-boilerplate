#!/usr/bin/env node
import { execFile, execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { Document } from 'yaml';

import {
  buildParentGraph,
  getPlatformPackageKeys,
  parseLockFile,
  someAncestor,
} from './common/lock-file.mjs';
import { error, log } from './common/logs.mjs';
import { parallelMap } from './common/parallel.mjs';

const lockFile = `${import.meta.dirname}/../pnpm-lock.yaml`;
const licensesLockFile = `${import.meta.dirname}/../licenses-lock.yaml`;

// The full license report exceeds the 1 MiB default buffer; cap it at 64 MiB.
const reportMaxBuffer = 67_108_864;

const registry = execFileSync('pnpm', ['config', 'get', 'registry'])
  .toString()
  .trim()
  .replace(/\/$/u, '');

const execFileAsync = promisify(execFile);

const execToJson = async (args) => {
  const { stdout } = await execFileAsync('pnpm', args.split(' '), {
    maxBuffer: reportMaxBuffer,
  });
  return JSON.parse(stdout);
};

const fetchTimeout = 15_000;
const fetchLicense = async ({ name, version }) => {
  try {
    const response = await fetch(`${registry}/${name}/${version}`, {
      signal: AbortSignal.timeout(fetchTimeout),
    });
    if (!response.ok) {
      throw new Error(`${response.status} (${response.statusText})`);
    }

    const { license, licenses } = await response.json();
    return typeof license === 'string'
      ? license
      : // Older packages expose the deprecated `licenses` array instead.
        (license?.type ?? licenses?.[0]?.type ?? 'UNKNOWN');
  } catch (reason) {
    error(`Failed to fetch ${name}@${version}: ${reason}`);
    return 'UNKNOWN';
  }
};

const toComponents = (report) => {
  return Object.values(report).flatMap((entries) => {
    return entries.flatMap(({ name, versions, license }) => {
      return versions.map((version) => ({ name, version, license }));
    });
  });
};

const keyOf = ({ name, version }) => `${name}@${version}`;

const componentOf = (key) => {
  const separator = key.lastIndexOf('@');
  return { name: key.slice(0, separator), version: key.slice(separator + 1) };
};

const byNameThenVersion = (first, second) => {
  if (first.name < second.name) {
    return -1;
  }
  if (first.name > second.name) {
    return 1;
  }
  if (first.version < second.version) {
    return -1;
  }
  if (first.version > second.version) {
    return 1;
  }
  return 0;
};

const distinctLicenses = (componentList) => {
  return [...new Set(componentList.map(({ license }) => license))].sort();
};

const lockfile = parseLockFile(lockFile);
const parentGraph = buildParentGraph(lockfile);

const platformPackageKeys = getPlatformPackageKeys(lockfile);
const platformPackages = [...platformPackageKeys].sort().map(componentOf);

const [platformLicenses, productionReport, fullReport] = await Promise.all([
  parallelMap(platformPackages, fetchLicense),
  execToJson('licenses ls --prod --json'),
  execToJson('licenses ls --json'),
]);

const productionKeys = new Set(toComponents(productionReport).map(keyOf));

const getPlatformPackageScope = (key) => {
  const isProduction =
    productionKeys.has(key) ||
    someAncestor(parentGraph, key, (parent) => productionKeys.has(parent));
  return isProduction ? 'prod' : 'dev';
};

const neutralComponents = toComponents(fullReport)
  .filter((component) => !platformPackageKeys.has(keyOf(component)))
  .map((component) => ({
    ...component,
    scope: productionKeys.has(keyOf(component)) ? 'prod' : 'dev',
  }));

const platformComponents = platformPackages.map((component, index) => ({
  ...component,
  license: platformLicenses[index],
  scope: getPlatformPackageScope(keyOf(component)),
  platform: true,
}));

const components = [
  ...neutralComponents.sort(byNameThenVersion),
  ...platformComponents.sort(byNameThenVersion),
];

const productionComponents = components.filter(({ scope }) => scope === 'prod');
const licenses = distinctLicenses(components);
const productionLicenses = distinctLicenses(productionComponents);

const document = new Document({
  summary: {
    componentCount: components.length,
    licenses,
    productionComponentCount: productionComponents.length,
    productionLicenses,
  },
  components,
});
for (const item of document.contents.items) {
  item.key.spaceBefore = true;
}

writeFileSync(licensesLockFile, document.toString());
log('Generated license lock file');
