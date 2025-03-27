import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

import { fallbackLocale } from './src/utilities/locale';

export default defineConfig({
  sourceLocale: fallbackLocale,
  locales: ['en-GB', 'de-DE'],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
  format: formatter({ explicitIdAsDefault: true, origins: false }),
  orderBy: 'messageId',
});
