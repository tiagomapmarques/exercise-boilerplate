#!/usr/bin/env node
import { execSync } from 'node:child_process';
import process from 'node:process';

import {
  error,
  hasLoggedError,
  hasLoggedWarnOrError,
  log,
  warn,
} from './common/logs.mjs';

try {
  execSync('git -v');
} catch {
  process.exit(1);
}

const errorOnWarnings = process.argv[2] === '--error-on-warnings';

const output = execSync('git status --porcelain').toString().trim();

if (output) {
  (errorOnWarnings ? error : warn)(
    `\nUncommitted changes found:\n  ${output.replaceAll('\n', '\n  ')}\n`,
  );
}

if (!hasLoggedWarnOrError()) {
  log('No uncommitted changes found');
}

if (hasLoggedError()) {
  process.exit(1);
}
