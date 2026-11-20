#!/usr/bin/env node
import { CheckPackages } from 'taze';

// biome-ignore lint/style/noRestrictedImports: Using taze programmatically does not read the config file automatically
import tazeConfig from '../taze.config.mts';
import { info, log } from './common/logs.mjs';
import {
  highlightSemver,
  parseSemver,
  stripRangePrefix,
} from './common/semver.mjs';

const { packages } = await CheckPackages({
  ...tazeConfig,
  mode: 'major',
  write: false,
});

const majorUpdates = packages
  .flatMap(({ resolved }) => resolved)
  .filter(({ diff }) => diff === 'major');

if (majorUpdates.length === 0) {
  log('No major dependency updates found');
} else {
  for (const { name, currentVersion, targetVersion } of majorUpdates) {
    const current = stripRangePrefix(currentVersion);
    const target = stripRangePrefix(targetVersion);
    const highlight = highlightSemver(
      parseSemver(target),
      parseSemver(current),
    );
    info(`Update ${name} to ${highlight} (current: ${current})`);
  }
}
