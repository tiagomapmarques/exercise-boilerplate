import { defineConfig } from 'taze';

// biome-ignore lint/style/noDefaultExport: Required by taze
export default defineConfig({
  maturityPeriod: 3, // Only suggest versions at least 3 days old, to avoid very fresh releases
  peer: true,
  includeLocked: true,
});
