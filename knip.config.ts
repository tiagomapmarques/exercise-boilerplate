import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['./bin/**/*.mjs', './src/**/*.{ts,tsx}'],
  entry: [
    './bin/*.mjs',
    './*.config.{ts,mts,js,mjs,cjs}',
    './src/routes/**/*.{ts,tsx}',
    './*.mjs',
  ],
  exclude: [
    // Excluding to favour import suggestions and API completeness of files
    'exports',
    'types',
  ],
  ignoreDependencies: [
    // Used in the Vite config as a string plugin reference — not an import
    '@lingui/swc-plugin',
    // Used in the Vite config via a runtime path — not an import
    'country-flag-icons',
    // Used in the PostCSS config (Mantine) as a string plugin key — not an import
    'postcss-preset-mantine',
  ],
};

// biome-ignore lint/style/noDefaultExport: Required by knip
export default config;
