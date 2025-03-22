/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: './src/testing/setup.tsx',

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
      exclude: ['src/testing/**', 'src/main.tsx'],
    },
  },
});
