import '@testing-library/react';
import '@mantine/core/styles.css';

import { setupI18n } from '@lingui/core';
import { configure } from '@testing-library/react';

import { messages } from '@/locales/en-GB.po';

configure({
  testIdAttribute: 'data-slot',
});

// This mock simulates the browser prefetching the locale. This is done to
// prevent the first renders in tests to output the translation keys instead.
vi.mock('@/i18n', async (importOriginal) => {
  const originalFile = await importOriginal<typeof import('@/i18n')>();
  return {
    ...originalFile,
    i18n: setupI18n({
      locale: originalFile.defaultLocale,
      messages: { [originalFile.defaultLocale]: messages },
    }),
  };
});
