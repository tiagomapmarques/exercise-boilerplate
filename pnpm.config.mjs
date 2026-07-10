import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  buildLicensesDocument,
  getLicense,
  normalizePackageKey,
  parseYamlLicenses,
} from './bin/common/licenses.mjs';
import { stringify } from './bin/common/yaml.mjs';

const licensesLockFile = join(import.meta.dirname, 'licenses-lock.yaml');
const licensesLockFileContent = existsSync(licensesLockFile)
  ? readFileSync(licensesLockFile).toString()
  : '';

const previousLicenses = parseYamlLicenses(licensesLockFileContent);
const collectedLicenses = new Map();

/** Forces pnpm to re-resolve so the hooks rebuild a missing lock file. */
const updateConfig = (config) => {
  if (!licensesLockFileContent) {
    // Skip pnpm's up-to-date shortcut so it enters the install flow instead of
    // reporting a no-op when only the licenses lock file is missing.
    config.optimisticRepeatInstall = false;
    // Force a full resolution so `afterAllResolved` runs and rebuilds the lock
    // file, rather than a headless install straight from the lockfile.
    config.forceFullResolution = true;
  }
  return config;
};

/** Records the resolved license of every package pnpm reads. */
const readPackage = (manifest) => {
  if (manifest.name && manifest.version) {
    const license = getLicense(manifest);

    // Resolutions that reconstruct a manifest from the lockfile carry no
    // license. Setting it could override valid ones from `previousLicenses`.
    if (license !== 'UNKNOWN') {
      collectedLicenses.set(normalizePackageKey(manifest), license);
    }
  }
  return manifest;
};

/** Rebuilds the license lock file once the dependency graph is resolved. */
const afterAllResolved = (lockfile) => {
  const document = buildLicensesDocument(
    lockfile,
    previousLicenses,
    collectedLicenses,
  );

  writeFileSync(licensesLockFile, stringify(document));
  return lockfile;
};

export const hooks = { updateConfig, readPackage, afterAllResolved };
