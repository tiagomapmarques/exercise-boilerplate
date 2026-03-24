#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import Ajv from 'ajv';
import { parse } from 'node-html-parser';

import { execAsync } from './common/exec.mjs';

const gitIgnoreFile = `${import.meta.dirname}/../.gitignore`;

const biomeConfigFile = `${import.meta.dirname}/../biome.json`;
const biomeConfigContent = readFileSync(biomeConfigFile).toString();

const getExpectedSetting = (section) => {
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
      config[sections[sectionIndex]][rule] = getExpectedSetting(
        sections[sectionIndex],
      );
    } else {
      sectionIndex += 1;
      config[sections[sectionIndex]] = { recommended: true };
    }
  }
  return config;
};

const buildNewRules = async (previous) => {
  const linterRules = await getNewRules();

  for (const [section, rules] of Object.entries(previous)) {
    const expected = getExpectedSetting(section);

    for (const [rule, setting] of Object.entries(rules)) {
      if (setting !== undefined && setting !== true && setting !== expected) {
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
      new RegExp(`\\s*"${property}"\\s*:\\s*.*\\s*,\\n`, 'u'),
      '\n',
    );
  }

  return JSON.parse(jsonString).linter.rules;
};

const writeBiomeConfig = async (config) => {
  const content = `${JSON.stringify(config, undefined, 2)}\n`;

  writeFileSync(biomeConfigFile, content);
  await execAsync(`pnpm biome check --write ${biomeConfigFile}`);
};

const biomeConfig = JSON.parse(biomeConfigContent);

biomeConfig.files.includes = getIncludes();
biomeConfig.linter.rules = await buildNewRules(biomeConfig.linter.rules);
biomeConfig.linter.rules = await getValidRules(biomeConfig);

await writeBiomeConfig(biomeConfig);
