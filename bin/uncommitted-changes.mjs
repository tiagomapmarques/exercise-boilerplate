#!/usr/bin/env node
import { execSync } from 'node:child_process';

import { log, logError, logWarning } from './common/logs.mjs';

try {
  execSync('git --version');
} catch {
  logError('git not found in PATH');
  process.exit(1);
}

const projectRoot = `${import.meta.dirname}/..`;
const shouldErrorOnWarnings = process.argv.includes('--error-on-warnings');
const output = execSync('git status --porcelain -- .', { cwd: projectRoot })
  .toString()
  .trim();

if (!output) {
  log('No uncommitted changes found');
  process.exit(0);
}

const message = `\nUncommitted changes found:\n  ${output.replaceAll('\n', '\n  ')}\n`;

if (shouldErrorOnWarnings) {
  logError(message);
  process.exit(1);
}
logWarning(message);
