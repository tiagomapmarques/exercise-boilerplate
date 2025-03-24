import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

import { defaultLocale } from './src/i18n';

export default defineConfig({
  sourceLocale: defaultLocale,
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
