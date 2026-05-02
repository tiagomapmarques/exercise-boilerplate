import {
  fallbackLocale,
  languageMap,
  localeLabels,
  locales,
} from './constants';

describe('locale and language maps', () => {
  it('defines labels for all locales', () => {
    const configMatch = {
      label: expect.any(String),
      country: expect.any(String),
      code: expect.stringMatching(/^[A-Z][A-Z]$/u),
    };

    expect(localeLabels).toStrictEqual({
      'en-GB': configMatch,
      'fr-FR': configMatch,
      'de-DE': configMatch,
    });
  });

  it('defines default locales for all languages', () => {
    expect(languageMap).toStrictEqual({
      en: expect.stringMatching(/^en-[A-Z][A-Z]$/u),
      fr: expect.stringMatching(/^fr-[A-Z][A-Z]$/u),
      de: expect.stringMatching(/^de-[A-Z][A-Z]$/u),
    });
  });

  it('defines a valid default locale', () => {
    expect(fallbackLocale).toBeTruthy();

    expect(locales.includes(fallbackLocale)).toBeTruthy();
  });
});
