import type { Mock } from 'vitest';
import { setupI18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';

import { loadLocale } from './utilities';

vi.mock('@lingui/detect-locale', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@lingui/detect-locale')>();
  return {
    ...original,
    detect: vi.fn(original.detect),
    fromNavigator: vi.fn(original.fromNavigator),
  };
});

describe(loadLocale, () => {
  beforeEach(() => {
    (detect as Mock<typeof detect>).mockImplementation((value) => value);
  });

  it.each`
    browser      | locale
    ${undefined} | ${'en-GB'}
    ${null}      | ${'en-GB'}
    ${'en-GB'}   | ${'en-GB'}
    ${'en-US'}   | ${'en-GB'}
    ${'en'}      | ${'en-GB'}
    ${'fr'}      | ${'fr-FR'}
    ${'de-DE'}   | ${'de-DE'}
    ${'de-AT'}   | ${'de-DE'}
    ${'es-ES'}   | ${'en-GB'}
    ${'es'}      | ${'en-GB'}
  `('guesses $locale from $browser', async ({ browser, locale }) => {
    (fromNavigator as Mock<typeof fromNavigator>).mockReturnValue(browser);

    const i18n = setupI18n();

    expect(i18n.locale).toBe('');
    expect(i18n.messages).toEqual({});

    await loadLocale(i18n);

    expect(i18n.locale).toBe(locale);
    expect(i18n.messages).toMatchObject({
      'boilerplate.home.title': [expect.stringMatching(/^((?!boilerplate).)/)],
    });
  });
});
