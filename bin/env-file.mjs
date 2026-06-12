#!/usr/bin/env node
import { copyFileSync, existsSync } from 'node:fs';

import { log } from './common/logs.mjs';

const envFile = `${import.meta.dirname}/../.env`;
const envExampleFile = `${import.meta.dirname}/../.env.example`;

if (!existsSync(envFile)) {
  copyFileSync(envExampleFile, envFile);
  log('Generated .env file');
}
