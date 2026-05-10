import { setupI18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';

import type { Mock } from '@/testing';

import { loadLocale } from './utilities';

vi.mock('@lingui/detect-locale', async (importActual) => {
  const original = await importActual<typeof import('@lingui/detect-locale')>();
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
    ${undefined} | ${'es-'}     | ${'es-ES'}
    ${undefined} | ${'pl-PL'}   | ${'en-GB'}
    ${undefined} | ${'pl-'}     | ${'en-GB'}
    ${undefined} | ${'pl'}      | ${'en-GB'}
    ${''}        | ${'de-DE'}   | ${'de-DE'}
    ${''}        | ${'de-'}     | ${'de-DE'}
    ${''}        | ${'de'}      | ${'de-DE'}
    ${''}        | ${'pl'}      | ${'en-GB'}
    ${'de-DE'}   | ${'en'}      | ${'de-DE'}
    ${'de'}      | ${'en-GB'}   | ${'de-DE'}
    ${'de-DE'}   | ${'pl'}      | ${'de-DE'}
    ${'de'}      | ${'pl-PL'}   | ${'de-DE'}
    ${'pl-PL'}   | ${'de'}      | ${'en-GB'}
    ${'pl'}      | ${'de-DE'}   | ${'en-GB'}
    ${'pl-PL'}   | ${'pl'}      | ${'en-GB'}
    ${'pl'}      | ${'pl-PL'}   | ${'en-GB'}
  `(
    'guesses $expected locale from $browser and $loaded',
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
        'pages.home.title': [expect.stringMatching(/^((?!pages\.).)/u)],
      });
    },
  );
});
