import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['./src/**/*.{ts,tsx}'],
  entry: ['./src/main.tsx', './*.{js,mjs,ts,mts}'],
  exclude: [
    // Excluding to favour import suggestions and API completeness of files
    'exports',
    'types',
  ],
  ignoreDependencies: [
    // Ignored as it's used in the vite config
    '@lingui/swc-plugin',
    '@vitest/coverage-istanbul',
  ],
  ignore: [
    // Ignored as it's the testing setup file
    'src/testing/setup.tsx',
  ],
};

export default config;
