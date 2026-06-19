#!/usr/bin/env node
import { execSync } from 'node:child_process';

import { error, log, warn } from './common/logs.mjs';

try {
  execSync('git --version');
} catch {
  error('git not found in PATH');
  process.exit(1);
}

const errorOnWarnings = process.argv.includes('--error-on-warnings');
const output = execSync('git status --porcelain').toString().trim();

if (!output) {
  log('No uncommitted changes found');
  process.exit(0);
}

const message = `\nUncommitted changes found:\n  ${output.replaceAll('\n', '\n  ')}\n`;

if (errorOnWarnings) {
  error(message);
  process.exit(1);
}
warn(message);
