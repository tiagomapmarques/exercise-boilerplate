import { setupI18n } from '@lingui/core';

export const i18n = setupI18n({
  locale: 'en-GB',
  // Adding empty messages avoids a console warning on browser startup
  messages: { 'en-GB': {} },
});
