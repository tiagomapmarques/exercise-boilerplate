import { defineConfig } from 'taze';

// biome-ignore lint/style/noDefaultExport: Required by taze
export default defineConfig({
  maturityPeriod: 3,
  peer: true,
  includeLocked: true,
});
