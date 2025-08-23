import {
  fallbackLocale,
  LanguageMap,
  localeLabels,
  locales,
} from './constants';

describe('locale and language maps', () => {
  it('defines labels for all locales', () => {
    const configMatch = {
      label: expect.stringMatching(/./),
      country: expect.stringMatching(/./),
    };

    expect(localeLabels).toStrictEqual({
      'en-GB': configMatch,
      'fr-FR': configMatch,
      'de-DE': configMatch,
    });
  });

  it('defines default locales for all languages', () => {
    const anyLocale = /(en-GB)|(fr-FR)|(de-DE)/;

    expect(LanguageMap).toStrictEqual({
      en: expect.stringMatching(anyLocale),
      fr: expect.stringMatching(anyLocale),
      de: expect.stringMatching(anyLocale),
    });
  });

  it('defines a valid default locale', () => {
    expect(locales.includes(fallbackLocale)).toBeTruthy();
  });
});
