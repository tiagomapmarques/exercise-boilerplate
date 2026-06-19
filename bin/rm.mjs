#!/usr/bin/env node
import { rm } from 'node:fs/promises';

const paths = process.argv.slice(2);

await Promise.all(
  paths.map((path) => rm(path, { recursive: true, force: true })),
);
