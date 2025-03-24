import { setupI18n } from '@lingui/core';

export const defaultLocale = 'en-GB';

export const i18n = setupI18n({
  locale: defaultLocale,
  // Adding empty messages avoids a console warning on browser startup
  messages: { [defaultLocale]: {} },
});
