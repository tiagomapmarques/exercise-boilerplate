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
vi.mock('@/i18n', () => ({
  i18n: setupI18n({ locale: 'en-GB', messages: { 'en-GB': messages } }),
}));
