import {
  fallbackLocale,
  languageMap,
  localeMetadata,
  locales,
} from './constants.mts';

describe('locale and language maps', () => {
  it('defines default locales for all languages', () => {
    for (const [language, locale] of Object.entries(languageMap)) {
      expect(locale).toMatch(new RegExp(`^${language}-[A-Z][A-Z]$`, 'u'));
    }
  });

  it('defines a valid default locale', () => {
    expect(fallbackLocale).toBeDefined();

    expect(locales).toContain(fallbackLocale);
  });

  describe.each(Object.values(localeMetadata))(
    'the locale is $label',
    ({ label, country, code }) => {
      it('defines a label', () => {
        expect(label).toBeTypeOf('string');
      });

      it('defines a country', () => {
        expect(country).toBeTypeOf('string');
      });

      it('defines a country code', () => {
        expect(code).toMatch(/^[A-Z][A-Z]$/u);
      });
    },
  );
});
