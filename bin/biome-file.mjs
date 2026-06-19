#!/usr/bin/env node
import { exec as execCallback, execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { promisify } from 'node:util';

import { info, warn } from './common/logs.mjs';
import { parallelMap } from './common/parallel.mjs';

const execPromise = promisify(execCallback);

const biomeConfigFile = `${import.meta.dirname}/../biome.json`;
const gitIgnoreFile = `${import.meta.dirname}/../.gitignore`;
const biomeBinary = `${import.meta.dirname}/../node_modules/.bin/biome`;
const biomePackageFile = `${import.meta.dirname}/../node_modules/@biomejs/biome/package.json`;
const schemaFile = `${import.meta.dirname}/../node_modules/@biomejs/biome/configuration_schema.json`;
const { version: biomeVersion } = JSON.parse(
  readFileSync(biomePackageFile).toString(),
);
const ruleCacheDirectory = `${import.meta.dirname}/../.tmp/biome`;
const ruleCacheFile = `${ruleCacheDirectory}/${biomeVersion}.json`;

const biomeConfig = JSON.parse(readFileSync(biomeConfigFile).toString());
const schema = JSON.parse(readFileSync(schemaFile).toString());

const allDomains = schema.$defs.RuleDomain.oneOf
  .map((entry) => ({ name: entry.const, description: entry.description }))
  .sort((left, right) => left.name.localeCompare(right.name));

const selectedDomains = Object.entries(biomeConfig.linter?.domains ?? {})
  .filter(([name, value]) => {
    if (value === 'none') {
      return false;
    }
    if (!allDomains.some((domain) => domain.name === name)) {
      warn(`Unknown domain '${name}' in biome.json - skipping.`);
      return false;
    }
    return true;
  })
  .map(([name]) => name);

const nonSectionKeys = ['recommended', 'preset'];

// Nursery is the largest and most volatile section. Pushing it to the end keeps
// the rest of the generated file easier to diff.
const sectionKeys = Object.keys(schema.$defs.Rules.properties)
  .filter((key) => !nonSectionKeys.includes(key) && key !== 'nursery')
  .sort()
  .concat('nursery');

const defaultSeverityRegex = /Default severity:\s*(?<severity>\w+)/u;
const globalRecommendationRegex = /^\s*-\s*This rule is recommended\s*$/mu;
const domainBlockRegex = /^Domains\s*\n(?<body>[\s\S]*?)(?:^Description|$)/mu;
const domainNameRegex = /^\s*-\s*Name:\s*(?<domain>\w+)\s*$/gmu;

const validSeverities = ['off', 'info', 'warn', 'error'];

const explainRule = async (rule) => {
  const { stdout } = await execPromise(`${biomeBinary} explain ${rule}`);

  const defaultSeverity = defaultSeverityRegex.exec(stdout)?.groups.severity;
  if (!validSeverities.includes(defaultSeverity)) {
    warn(
      `Unexpected default severity '${defaultSeverity}' for rule '${rule}' - skipping.`,
    );
    return;
  }

  const globallyRecommended = globalRecommendationRegex.test(stdout);
  const domains = [
    ...(domainBlockRegex.exec(stdout)?.groups.body ?? '').matchAll(
      domainNameRegex,
    ),
  ].map((match) => match.groups.domain);

  return { defaultSeverity, globallyRecommended, domains };
};

const getRuleDefinitions = async () => {
  const ruleEntries = sectionKeys.flatMap((section) => {
    const schemaKey = section[0].toUpperCase() + section.slice(1);
    if (!schema.$defs[schemaKey]?.properties) {
      warn(
        `Schema is missing properties for section '${section}' (expected key '${schemaKey}'); the casing convention may have changed.`,
      );
    }

    return Object.keys(schema.$defs[schemaKey]?.properties ?? {})
      .filter((rule) => !nonSectionKeys.includes(rule))
      .map((rule) => ({ section, rule }));
  });

  const ruleResults = await parallelMap(ruleEntries, ({ rule }) =>
    explainRule(rule),
  );

  const definitions = Object.fromEntries(
    sectionKeys.map((section) => [section, {}]),
  );
  for (const [ruleIndex, { section, rule }] of ruleEntries.entries()) {
    const result = ruleResults[ruleIndex];
    if (result) {
      definitions[section][rule] = result;
    }
  }

  return definitions;
};

const loadBiomeRules = async () => {
  if (existsSync(ruleCacheFile)) {
    return JSON.parse(readFileSync(ruleCacheFile).toString());
  }

  const rules = await getRuleDefinitions();

  const tempCacheFile = `${ruleCacheFile}.tmp`;
  mkdirSync(ruleCacheDirectory, { recursive: true });
  writeFileSync(tempCacheFile, `${JSON.stringify(rules, undefined, 2)}\n`);
  renameSync(tempCacheFile, ruleCacheFile);

  return rules;
};

const biomeRules = await loadBiomeRules();

info(
  `Disabled domains:\n${allDomains
    .filter(({ name }) => !selectedDomains.includes(name))
    .map(({ name, description }) => `  ${name}: ${description}`)
    .join('\n')}`,
);

const hasSelectedDomain = ({ domains }) =>
  domains.length === 0 ||
  domains.some((domain) => selectedDomains.includes(domain));

const computeSeverity = (definition) => {
  if (!hasSelectedDomain(definition)) {
    return 'off';
  }
  return definition.defaultSeverity === 'info'
    ? 'warn'
    : definition.defaultSeverity;
};

const shouldEmitExplicit = (section, definition, severity) => {
  if (severity === 'off') {
    return false;
  }

  const isInSelectedDomain = definition.domains.some((domain) =>
    selectedDomains.includes(domain),
  );

  // Nursery rules never auto-activate via linter.domains - they must be listed
  // explicitly even when their domain is set to 'all'.
  const isNurseryDomainGated =
    section === 'nursery' &&
    isInSelectedDomain &&
    !definition.globallyRecommended;

  // Rules auto-activate at their default severity when globally recommended or
  // in a selected domain - only emit on severity drift. See
  // https://biomejs.dev/reference/configuration/#linterdomains.
  const isAutoActivatedAtDefault =
    definition.defaultSeverity === severity &&
    (definition.globallyRecommended || isInSelectedDomain);

  return isNurseryDomainGated || !isAutoActivatedAtDefault;
};

const buildDomains = () => {
  return Object.fromEntries(
    allDomains
      .filter(({ name }) => selectedDomains.includes(name))
      .map(({ name }) => [name, 'all']),
  );
};

const buildSectionRules = (section) => {
  const rules = {};
  for (const [rule, definition] of Object.entries(biomeRules[section] ?? {})) {
    const severity = computeSeverity(definition);
    if (shouldEmitExplicit(section, definition, severity)) {
      rules[rule] = severity;
    }
  }
  return rules;
};

const buildCleanRules = () => {
  return Object.fromEntries(
    sectionKeys.map((section) => [section, buildSectionRules(section)]),
  );
};

const findCustomSetting = (section, rule, setting) => {
  const definition = biomeRules[section]?.[rule];

  // Drop overrides for rules no longer in this section, or in non-selected domains
  if (!(definition && hasSelectedDomain(definition))) {
    return;
  }

  // Preserve "off" and object-shaped settings (custom level/options)
  return typeof setting !== 'string' || setting === 'off' ? setting : undefined;
};

const extractCustomSettings = (previousRules) => {
  const customSettings = {};
  for (const [section, sectionRules] of Object.entries(previousRules ?? {})) {
    if (sectionRules && typeof sectionRules === 'object') {
      for (const [rule, setting] of Object.entries(sectionRules)) {
        const customSetting = findCustomSetting(section, rule, setting);

        if (customSetting !== undefined) {
          customSettings[section] = customSettings[section] ?? {};
          customSettings[section][rule] = customSetting;
        }
      }
    }
  }
  return customSettings;
};

const buildNewRules = (previousRules) => {
  const cleanRules = buildCleanRules();
  const customSettings = extractCustomSettings(previousRules);

  const sortRules = (rules) =>
    Object.fromEntries(
      Object.entries(rules).sort(([leftKey], [rightKey]) =>
        leftKey.localeCompare(rightKey),
      ),
    );

  return Object.fromEntries(
    sectionKeys.map((section) => [
      section,
      sortRules({
        ...cleanRules[section],
        ...(customSettings[section] ?? {}),
      }),
    ]),
  );
};

const buildIncludes = () => {
  const gitIgnores = readFileSync(gitIgnoreFile)
    .toString()
    .split('\n')
    .map((line) => line.split('#')[0].trim())
    .filter((line) => Boolean(line));

  // Re-include patterns (`!foo`) from .gitignore are dropped: biome's include
  // semantics don't map onto gitignore's nested re-inclusion.
  return [
    '**/*',
    ...gitIgnores
      .filter((line) => !line.startsWith('!'))
      .map((line) => `!**/${line}`),
  ];
};

const writeBiomeConfig = (config) => {
  const content = `${JSON.stringify(config, undefined, 2)}\n`;

  writeFileSync(biomeConfigFile, content);
  execSync(`${biomeBinary} check --write "${biomeConfigFile}"`, {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
};

biomeConfig.files.includes = buildIncludes();
biomeConfig.linter.domains = buildDomains();
biomeConfig.linter.rules = buildNewRules(biomeConfig.linter.rules);

writeBiomeConfig(biomeConfig);
