import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

/** Parses a pnpm lockfile. */
export const parseLockFile = (filePath) => {
  return parse(readFileSync(filePath, 'utf8'));
};

// A lockfile key is `name@version` optionally followed by `(peer)` suffixes.
const baseKey = (key) => key.split('(')[0];

/** Returns the set of package keys restricted to a specific os, cpu, or libc. */
export const getPlatformPackageKeys = (lockfile) => {
  return new Set(
    Object.entries(lockfile.packages)
      .filter(([, { os, cpu, libc }]) => os || cpu || libc)
      .map(([key]) => key),
  );
};

/** Maps every package key to the set of package keys that depend on it. */
export const buildParentGraph = (lockfile) => {
  const parentsByPackage = new Map();

  for (const [snapshotKey, snapshot] of Object.entries(lockfile.snapshots)) {
    const dependencies = {
      ...snapshot.dependencies,
      ...snapshot.optionalDependencies,
    };

    for (const [name, version] of Object.entries(dependencies)) {
      const dependencyKey = `${name}@${baseKey(version)}`;
      const parents = parentsByPackage.get(dependencyKey) ?? new Set();
      parents.add(baseKey(snapshotKey));

      parentsByPackage.set(dependencyKey, parents);
    }
  }

  return parentsByPackage;
};

/** Tests whether any transitive parent of `key` satisfies `predicate`. */
export const someAncestor = (parentGraph, key, predicate) => {
  const visited = new Set();
  const stack = [...(parentGraph.get(key) ?? [])];

  while (stack.length > 0) {
    const parent = stack.pop();

    if (!visited.has(parent)) {
      visited.add(parent);

      if (predicate(parent)) {
        return true;
      }
      stack.push(...(parentGraph.get(parent) ?? []));
    }
  }

  return false;
};
