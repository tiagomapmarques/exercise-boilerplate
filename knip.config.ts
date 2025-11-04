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
    // Used in scripts
    'node-html-parser',
    // Used in the Vite config
    '@lingui/swc-plugin',
    'country-flag-icons',
    // Used in the Mantine PostCSS config
    'postcss-preset-mantine',
  ],
};

// biome-ignore lint/style/noDefaultExport: Necessary for it to work
export default config;
