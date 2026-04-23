#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

import { log } from './common/logs.mjs';

const startTime = Date.now();

const envFile = `${import.meta.dirname}/../.env`;
const envExampleFile = `${import.meta.dirname}/../.env.example`;

if (!existsSync(envFile)) {
  writeFileSync(envFile, readFileSync(envExampleFile).toString(), 'utf8');
  log(`Generated .env file in ${Date.now() - startTime}ms`);
}
