/// <reference types="vitest/config" />
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tsconfigPaths(),
  ],
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
      exclude: [
        'src/routes/**',
        'src/testing/**',
        'src/**/*.gen.ts',
        'src/main.tsx',
      ],
    },
  },
});
