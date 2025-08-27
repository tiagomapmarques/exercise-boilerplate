import { defineConfig } from 'vite';

import viteConfig from './vite.config.mjs';

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    setupFiles: './vitest.setup.mts',
    mockReset: true,
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**'],
      exclude: [
        'src/components/dev-tools/**',
        'src/routes/**',
        'src/locales/**',
        'src/testing/**',
        'src/*.gen.ts',
        'src/main.tsx',
      ],
    },
  },
});
