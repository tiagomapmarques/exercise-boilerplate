import {
  fallbackLocale,
  languageMap,
  localeMetadata,
  locales,
} from './constants';

describe('locale and language maps', () => {
  const metadata = Object.values(localeMetadata);

  describe.each(metadata)('for $label', ({ label, country, code }) => {
    it('defines a label', () => {
      expect(label).toBeTypeOf('string');
    });

    it('defines a country', () => {
      expect(country).toBeTypeOf('string');
    });

    it('defines a country code', () => {
      expect(code).toMatch(/^[A-Z][A-Z]$/u);
    });
  });

  it('defines default locales for all languages', () => {
    for (const [language, locale] of Object.entries(languageMap)) {
      expect(locale).toMatch(new RegExp(`^${language}-[A-Z][A-Z]$`, 'u'));
    }
  });

  it('defines a valid default locale', () => {
    expect(fallbackLocale).toBeTruthy();

    expect(locales.includes(fallbackLocale)).toBeTruthy();
  });
});
