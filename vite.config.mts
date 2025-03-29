import { lingui } from '@lingui/vite-plugin';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react({ plugins: [['@lingui/swc-plugin', {}]] }),
    lingui(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    setupFiles: './src/testing/setup.tsx',
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
        'src/locales/**',
        'src/routes/**',
        'src/testing/**',
        'src/*.gen.ts',
        'src/main.tsx',
      ],
    },
  },
});
