import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

import { fallbackLocale, locales } from './src/utilities/locale';

export default defineConfig({
  sourceLocale: fallbackLocale,
  locales: locales,
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
  format: formatter({ explicitIdAsDefault: true, origins: false }),
  orderBy: 'messageId',
});
