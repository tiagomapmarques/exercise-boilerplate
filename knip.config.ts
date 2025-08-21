import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['./src/**/*.{ts,tsx}'],
  entry: ['./*.{js,mjs,ts,mts}'],
  exclude: [
    // Excluding to favour import suggestions and API completeness of files
    'exports',
    'types',
  ],
  ignoreDependencies: [
    // Ignored as it's used in the vite config
    '@lingui/swc-plugin',
  ],
};

export default config;
