#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import Ajv from 'ajv';
import { parse } from 'node-html-parser';

const gitIgnoreFile = `${import.meta.dirname}/../.gitignore`;

const biomeConfigFile = `${import.meta.dirname}/../biome.json`;
const biomeConfigContent = readFileSync(biomeConfigFile).toString();

const nonReactRuleRegex =
  /[a-z](?<framework>Qwik|Solid|Vue|ReactNative|Next)[A-Z]/u;

const getExpectedSetting = (section, rule) => {
  if (nonReactRuleRegex.test(rule)) {
    return 'off';
  }
  return ['nursery', 'suspicious'].includes(section) ? 'warn' : 'error';
};

const getNewRules = async () => {
  const response = await fetch('https://biomejs.dev/linter/javascript/rules/');
  const data = await response.text();
  const document = parse(data);

  const sections = document
    .querySelectorAll('h2 code')
    .map((section) => section.textContent);

  const rules = document
    .querySelector('.sl-markdown-content')
    .querySelectorAll('table tr')
    .filter(
      (row) =>
        row.innerHTML.indexOf('aria-label="This rule is recommended"') < 0,
    )
    .map((rule) => rule.querySelector('a')?.textContent);

  const config = {};
  let sectionIndex = -1;
  for (const rule of rules) {
    if (rule) {
      const setting = getExpectedSetting(sections[sectionIndex], rule);
      config[sections[sectionIndex]][rule] = setting;
    } else {
      sectionIndex += 1;
      config[sections[sectionIndex]] = { recommended: true };
    }
  }
  return config;
};

const buildNewRules = async (previous) => {
  const linterRules = await getNewRules();

  for (const [section, allRules] of Object.entries(previous)) {
    const expected = getExpectedSetting(section);
    const rules = Object.entries(allRules).filter(
      ([rule, setting]) => !(rule === 'recommended' && setting === true),
    );

    for (const [rule, setting] of rules) {
      if (setting !== expected) {
        linterRules[section][rule] = setting;
      }
    }
  }

  const { suspicious, nursery, ...rest } = linterRules;
  return {
    ...rest,
    suspicious,
    nursery,
  };
};

const getGitIgnores = () => {
  const gitIgnoreContent = readFileSync(gitIgnoreFile).toString();

  return gitIgnoreContent
    .split('\n')
    .map((line) => (/^.*?#/u.exec(line)?.[0].slice(0, -1) ?? line).trim())
    .filter((line) => Boolean(line));
};

const getIncludes = () => {
  return ['**/*', ...getGitIgnores().map((ignore) => `!**/${ignore}`)];
};

const getValidRules = async (config) => {
  const schema = await (await fetch(config.$schema)).json();
  schema.$schema = undefined;

  const ajv = new Ajv({
    allErrors: true,
    formats: {
      uint8: true,
      uint16: true,
      uint64: true,
    },
  });

  ajv.validate(schema, config);

  const badProperties = (ajv.errors ?? [])
    .filter(({ keyword }) => keyword === 'additionalProperties')
    .map(({ params: { additionalProperty } }) => additionalProperty);

  let jsonString = JSON.stringify(config, undefined, 2);

  for (const property of badProperties) {
    jsonString = jsonString.replace(
      new RegExp(`\\s*"${property}"\\s*:\\s*.*\\s*,?\\n`, 'u'),
      '\n',
    );
  }

  jsonString = jsonString.replace(
    /,(?<closeBrace>\s*[}\]])/gu,
    '$<closeBrace>',
  );

  return JSON.parse(jsonString).linter.rules;
};

const writeBiomeConfig = (config) => {
  const content = `${JSON.stringify(config, undefined, 2)}\n`;

  writeFileSync(biomeConfigFile, content);
  execSync(`pnpm biome check --write ${biomeConfigFile}`);
};

const biomeConfig = JSON.parse(biomeConfigContent);

biomeConfig.files.includes = getIncludes();
biomeConfig.linter.rules = await buildNewRules(biomeConfig.linter.rules);
biomeConfig.linter.rules = await getValidRules(biomeConfig);

writeBiomeConfig(biomeConfig);
