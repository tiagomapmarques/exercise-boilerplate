import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'en-GB',
  locales: ['en-GB', 'de-DE'],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
});
