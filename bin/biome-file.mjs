#!/usr/bin/env node
import { exec as execCallback, execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { promisify } from 'node:util';

import { info } from './common/logs.mjs';

const execPromise = promisify(execCallback);

const gitIgnoreFile = `${import.meta.dirname}/../.gitignore`;
const biomeConfigFile = `${import.meta.dirname}/../biome.json`;
const biomeBin = `${import.meta.dirname}/../node_modules/.bin/biome`;
const biomePackageFile = `${import.meta.dirname}/../node_modules/@biomejs/biome/package.json`;
const schemaFile = `${import.meta.dirname}/../node_modules/@biomejs/biome/configuration_schema.json`;
const { version: biomeVersion } = JSON.parse(
  readFileSync(biomePackageFile).toString(),
);
const ruleCacheDirectory = `${import.meta.dirname}/../.tmp/biome`;
const ruleCacheFile = `${ruleCacheDirectory}/${biomeVersion}.json`;

const biomeConfigContent = readFileSync(biomeConfigFile).toString();
const schema = JSON.parse(readFileSync(schemaFile).toString());

const sectionKeys = Object.keys(schema.$defs.Rules.properties).filter(
  (key) => key !== 'recommended',
);

const warnSectionKeys = ['nursery', 'suspicious'];

const keptDomains = new Set([
  'react',
  'test',
  'project',
  'playwright',
  'types',
]);

const ignoredDomains = schema.$defs.RuleDomain.oneOf
  .filter((entry) => !keptDomains.has(entry.const.toLowerCase()))
  .map((entry) => ({
    name: entry.const.toLowerCase(),
    description: entry.description,
  }))
  .sort((left, right) => left.name.localeCompare(right.name));

const globalRecommendationRegex = /^\s*-\s*This rule is recommended\s*$/mu;
const domainRecommendationRegex = /The rule is recommended for this domain/u;
const domainRegex = /^Domains\s*\n(?<body>[\s\S]*?)^Description\s*$/mu;
const domainNameRegex = /^\s*-\s*Name:\s*(?<domain>\w+)\s*$/gmu;

const explainRule = async (rule) => {
  const { stdout } = await execPromise(`${biomeBin} explain ${rule}`);
  const isGloballyRecommended = globalRecommendationRegex.test(stdout);
  const isDomainRecommended = domainRecommendationRegex.test(stdout);

  const domains = [
    ...(domainRegex.exec(stdout)?.groups.body ?? '').matchAll(domainNameRegex),
  ].map((match) => match.groups.domain.toLowerCase());

  return {
    recommended: isGloballyRecommended || isDomainRecommended,
    domains,
  };
};

const computeDefaultSetting = (section, domains) => {
  const isFromIgnoredDomain =
    domains.length > 0 && domains.every((domain) => !keptDomains.has(domain));

  if (isFromIgnoredDomain) {
    return 'off';
  }
  return warnSectionKeys.includes(section) ? 'warn' : 'error';
};

const getRuleDefinitions = async () => {
  const ruleEntries = sectionKeys.flatMap((section) => {
    const schemaKey = section[0].toUpperCase() + section.slice(1);

    return Object.keys(schema.$defs[schemaKey]?.properties ?? {})
      .filter((rule) => rule !== 'recommended')
      .map((rule) => ({ section, rule }));
  });

  const ruleResults = await Promise.all(
    ruleEntries.map(async ({ section, rule }) => ({
      section,
      rule,
      ...(await explainRule(rule)),
    })),
  );

  const definitions = Object.fromEntries(
    sectionKeys.map((section) => [section, {}]),
  );
  for (const { section, rule, recommended, domains } of ruleResults) {
    definitions[section][rule] = {
      recommended,
      domains,
      defaultSetting: computeDefaultSetting(section, domains),
    };
  }

  return definitions;
};

const loadBiomeRules = async () => {
  if (existsSync(ruleCacheFile)) {
    return JSON.parse(readFileSync(ruleCacheFile).toString());
  }

  const rules = await getRuleDefinitions();

  rmSync(ruleCacheDirectory, { recursive: true, force: true });
  mkdirSync(ruleCacheDirectory, { recursive: true });
  writeFileSync(ruleCacheFile, `${JSON.stringify(rules, undefined, 2)}\n`);

  return rules;
};

const biomeRules = await loadBiomeRules();
info(
  `Disabled domains:\n${ignoredDomains
    .map(({ name, description }) => `  ${name}: ${description}`)
    .join('\n')}`,
);

const buildSectionRules = (section, previousSection) => {
  const sectionRules = Object.entries(biomeRules[section]);
  const previousSectionRules = Object.entries(previousSection);

  const rules = { recommended: true };

  for (const [rule, { recommended, defaultSetting }] of sectionRules) {
    const overridesBiomeDefault = !recommended || defaultSetting === 'off';

    if (overridesBiomeDefault) {
      rules[rule] = defaultSetting;
    }
  }

  for (const [rule, setting] of previousSectionRules) {
    const definition = biomeRules[section][rule];
    const isExplicitOverride =
      rule !== 'recommended' &&
      definition !== undefined &&
      setting !== definition.defaultSetting;

    if (isExplicitOverride) {
      rules[rule] = setting;
    }
  }

  return rules;
};

const buildNewRules = (previous) => {
  const linterRules = Object.fromEntries(
    sectionKeys.map((section) => [
      section,
      buildSectionRules(section, previous[section] ?? {}),
    ]),
  );

  const { suspicious, nursery, ...rest } = linterRules;
  return { ...rest, suspicious, nursery };
};

const getGitIgnores = () => {
  const gitIgnoreContent = readFileSync(gitIgnoreFile).toString();

  return gitIgnoreContent
    .split('\n')
    .map((line) => (line.startsWith('#') ? '' : line).trim())
    .filter((line) => Boolean(line));
};

const buildIncludes = () => {
  return [
    '**/*',
    ...getGitIgnores()
      .filter((ignore) => !ignore.startsWith('!'))
      .map((ignore) => `!**/${ignore}`),
  ];
};

const writeBiomeConfig = (config) => {
  const content = `${JSON.stringify(config, undefined, 2)}\n`;

  writeFileSync(biomeConfigFile, content);
  execSync(`pnpm biome check --write "${biomeConfigFile}"`);
};

const biomeConfig = JSON.parse(biomeConfigContent);

biomeConfig.files.includes = buildIncludes();
biomeConfig.linter.rules = buildNewRules(biomeConfig.linter.rules);

writeBiomeConfig(biomeConfig);
