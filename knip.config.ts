import { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['./src/**/*.{ts,tsx}'],
  entry: ['./src/main.tsx', './*.{js,mjs,ts,mts}'],
  exclude: [
    // Excluding to favour import suggestions and API completeness of files
    'exports',
    'types',
  ],
  ignoreDependencies: [
    // Ignored as it's used in the react vite config
    '@lingui/swc-plugin',
  ],
};

export default config;
