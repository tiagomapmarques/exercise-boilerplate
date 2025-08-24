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
    loaded       | browser      | expected
    ${undefined} | ${undefined} | ${'en-GB'}
    ${undefined} | ${null}      | ${'en-GB'}
    ${undefined} | ${'en-GB'}   | ${'en-GB'}
    ${undefined} | ${'en-US'}   | ${'en-GB'}
    ${undefined} | ${'en'}      | ${'en-GB'}
    ${undefined} | ${'fr'}      | ${'fr-FR'}
    ${undefined} | ${'de-DE'}   | ${'de-DE'}
    ${undefined} | ${'de-AT'}   | ${'de-DE'}
    ${undefined} | ${'es-ES'}   | ${'en-GB'}
    ${undefined} | ${'es'}      | ${'en-GB'}
    ${'de-DE'}   | ${'en'}      | ${'de-DE'}
    ${'de'}      | ${'en-GB'}   | ${'de-DE'}
    ${'de-DE'}   | ${'es'}      | ${'de-DE'}
    ${'de'}      | ${'es-ES'}   | ${'de-DE'}
    ${'es-ES'}   | ${'de'}      | ${'en-GB'}
    ${'es'}      | ${'de-DE'}   | ${'en-GB'}
    ${'es-ES'}   | ${'es'}      | ${'en-GB'}
    ${'es'}      | ${'es-ES'}   | ${'en-GB'}
  `(
    'guesses $expected from $browser and $loaded',
    async ({ loaded, browser, expected }) => {
      (fromNavigator as Mock<typeof fromNavigator>).mockReturnValue(browser);

      const i18n = setupI18n(
        loaded && {
          locale: loaded,
          messages: { [loaded]: {} },
        },
      );

      expect(i18n.locale).toBe(loaded || '');
      expect(i18n.messages).toEqual({});

      await loadLocale(i18n);

      expect(i18n.locale).toBe(expected);
      expect(i18n.messages).toMatchObject({
        'home.title': [expect.stringMatching(/^((?!home\.).)/)],
      });
    },
  );
});
