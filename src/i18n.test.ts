import { i18n as linguiI18n } from '@lingui/core';

import { i18n } from './i18n';

vi.unmock('@/i18n');

describe('i18n', () => {
  test('creates a custom i18n variable', () => {
    expect(i18n).toBeDefined();
    expect(i18n).not.toBe(linguiI18n);
  });

  test('adds an activates locale', () => {
    expect(i18n.locale).toBe('en-GB');
  });

  test('adds a mock messages object', () => {
    expect(i18n.messages).toBeDefined();
    expect(Object.keys(i18n.messages)).toHaveLength(0);
  });
});
