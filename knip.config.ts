import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['./bin/**/*.mjs', './src/**/*.{ts,tsx,mts}', './e2e/**/*.ts'],
  entry: [
    './bin/*.mjs',
    './*.config.{ts,mts,js,mjs,cjs}',
    './src/routes/**/*.{ts,tsx}',
    './e2e/**/*.spec.ts',
  ],
  exclude: [
    // Types are exported for API completeness, whether or not they are used
    'types',
  ],
  ignoreDependencies: [
    // Used in the Vite config via a runtime path - not an import
    'country-flag-icons',
    // Used in the PostCSS config as string plugin keys - not imports
    'postcss-preset-mantine',
    'postcss-simple-vars',
  ],
};

// biome-ignore lint/style/noDefaultExport: Required by knip
export default config;
