import { defineConfig } from 'taze';

// biome-ignore lint/style/noDefaultExport: Required by taze
export default defineConfig({
  maturityPeriod: 3, // Keep in sync with `pnpm-workspace.yaml`
  peer: true,
  includeLocked: true,
  exclude: ['node'], // `./bin/check-engines.mjs` performs a more complete check
});
