import { unquote } from './yaml.mjs';

/** Resolves a manifest's license, tolerating the deprecated `licenses` array. */
export const getLicense = ({ license, licenses }) => {
  if (typeof license === 'string') {
    return license;
  }
  return license?.type ?? licenses?.[0]?.type ?? 'UNKNOWN';
};

const componentPattern =
  /- name: (?<name>.+)\n\s+version: (?<version>.+)\n\s+license: (?<license>.+)/gu;

/** Parses a committed lock file so packages untouched by a resolution keep their license. */
export const parseYamlLicenses = (contents) => {
  const previousLicenses = new Map();
  for (const { groups } of contents.matchAll(componentPattern)) {
    const key = `${unquote(groups.name)}@${unquote(groups.version)}`;
    previousLicenses.set(key, unquote(groups.license));
  }
  return previousLicenses;
};

const parsePackageKey = (key) => {
  const [normalizedKey] = key.split('(');
  const separator = normalizedKey.lastIndexOf('@');
  const name = normalizedKey.slice(0, separator);
  const version = normalizedKey.slice(separator + 1);
  return { name, version, key: `${name}@${version}` };
};

/** Returns the `name@version` key for a manifest, stripping any peer suffix. */
export const normalizePackageKey = ({ name, version }) => {
  return parsePackageKey(`${name}@${version}`).key;
};

const byNameThenVersion = (first, second) => {
  if (first.name !== second.name) {
    return first.name < second.name ? -1 : 1;
  }
  if (first.version !== second.version) {
    return first.version < second.version ? -1 : 1;
  }
  return 0;
};

const uniqueSortedLicenses = (componentList) => {
  return [...new Set(componentList.map(({ license }) => license))].sort();
};

const dependencyKeys = ({ dependencies, optionalDependencies }) => {
  return Object.entries({ ...dependencies, ...optionalDependencies }).map(
    ([name, version]) => parsePackageKey(`${name}@${version}`).key,
  );
};

// Returns the packages reachable from importer production dependencies; the
// in-memory lockfile lists each package's dependencies inline, so the graph is
// read from `packages` rather than a `snapshots` block.
const buildProductionSet = ({ packages, importers }) => {
  const packageDependencies = {};
  for (const [packageKey, metadata] of Object.entries(packages ?? {})) {
    const { key } = parsePackageKey(packageKey);
    packageDependencies[key] = [
      ...(packageDependencies[key] ?? []),
      ...dependencyKeys(metadata),
    ];
  }

  const production = new Set();
  const stack = Object.values(importers ?? {}).flatMap(dependencyKeys);

  while (stack.length > 0) {
    const packageKey = stack.pop();

    if (!production.has(packageKey)) {
      production.add(packageKey);
      stack.push(...(packageDependencies[packageKey] ?? []));
    }
  }
  return production;
};

/** Builds the licenses document from a resolved lockfile and collected licenses. */
export const buildLicensesDocument = (
  lockfile,
  previousLicenses,
  collectedLicenses,
) => {
  const production = buildProductionSet(lockfile);

  const metadataByPackage = {};
  for (const [key, metadata] of Object.entries(lockfile.packages ?? {})) {
    metadataByPackage[parsePackageKey(key).key] = metadata;
  }

  const components = Object.entries(metadataByPackage)
    .map(([key, { os, cpu, libc }]) => {
      const { name, version } = parsePackageKey(key);
      return {
        name,
        version,
        license:
          collectedLicenses.get(key) ?? previousLicenses.get(key) ?? 'UNKNOWN',
        scope: production.has(key) ? 'prod' : 'dev',
        platform: Boolean(os || cpu || libc),
      };
    })
    .sort(byNameThenVersion);

  const productionComponents = components.filter(
    ({ scope }) => scope === 'prod',
  );

  return {
    summary: {
      componentCount: components.length,
      licenses: uniqueSortedLicenses(components),
      productionComponentCount: productionComponents.length,
      productionLicenses: uniqueSortedLicenses(productionComponents),
    },
    components,
  };
};
