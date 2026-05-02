#!/usr/bin/env node
import { execSync } from 'node:child_process';

import { log } from './common/logs.mjs';

const getDependencyNames = (command) => {
  const content = execSync(command).toString().trim();

  const names = content
    .split('\n')
    .filter((line) => line.startsWith('   ') && Boolean(line.trim()))
    .map((line) => line.trim().split(' ')[0]);

  return [...new Set(names)];
};

const otherArgs = process.argv.slice(2).join(' ');

const packageNames = getDependencyNames(`pnpm taze minor ${otherArgs}`);
const excludeArg = packageNames.length > 0 ? `--exclude ${packageNames}` : '';

const outputBuffer = execSync(`pnpm taze major ${excludeArg} ${otherArgs}`);
const output =
  outputBuffer.toString().trim().split('\n').length > 1
    ? outputBuffer
    : 'No dependency updates found';

log(output);
