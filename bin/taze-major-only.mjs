#!/usr/bin/env node
import { execSync } from 'node:child_process';

import { log } from './common/logs.mjs';

const passthroughArgs = process.argv.slice(2).join(' ');
const tazeMinorCommand = `pnpm taze minor ${passthroughArgs}`;

/** Extracts package names from taze's indented summary rows. */
const extractPackageNames = (command) => {
  const output = execSync(command).toString();
  return output
    .split('\n')
    .filter((line) => line.startsWith('   ') && line.trim() !== '')
    .map((line) => line.trim().split(' ')[0])
    .filter((name, index, array) => array.indexOf(name) === index);
};

const excludeList = extractPackageNames(tazeMinorCommand);
const excludeArg = excludeList.length > 0 ? `--exclude ${excludeList}` : '';

const result = execSync(`pnpm taze major ${excludeArg} ${passthroughArgs}`)
  .toString()
  .trim();

const resultIsMultiLine = result.split('\n').length > 1;

log(resultIsMultiLine ? result : 'No major dependency updates found');
