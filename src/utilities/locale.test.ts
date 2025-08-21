import type { Mock } from 'vitest';
import { setupI18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';

import { act, mockConsole, renderHook } from '@/testing';
import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import { messages as messagesFrFr } from '@/locales/fr-FR.po';

import {
  fallbackLocale,
  LanguageMap,
  type Locale,
  localeLabels,
  locales,
  preloadLocale,
  useLocale,
} from './locale';

vi.mock('@lingui/detect-locale', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@lingui/detect-locale')>();
  return {
    ...original,
    detect: vi.fn(original.detect),
    fromNavigator: vi.fn(original.fromNavigator),
  };
});

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

describe(preloadLocale, () => {
  it('loads en-GB messages', async () => {
    const i18n = setupI18n();

    await preloadLocale(i18n, 'en-GB');

    expect(i18n.locale).toBe('en-GB');
    expect(i18n.messages).toBe(messagesEnGb);
  });

  it('loads fr-FR messages', async () => {
    const i18n = setupI18n();

    await preloadLocale(i18n, 'fr-FR');

    expect(i18n.locale).toBe('fr-FR');
    expect(i18n.messages).toBe(messagesFrFr);
  });

  it('loads de-DE messages', async () => {
    const i18n = setupI18n();

    await preloadLocale(i18n, 'de-DE');

    expect(i18n.locale).toBe('de-DE');
    expect(i18n.messages).toBe(messagesDeDe);
  });

  describe('guessing the locale', () => {
    test.each`
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
    `(
      'browser with $browser locale, initial locale is $locale',
      async ({ browser, locale }) => {
        (detect as Mock<typeof detect>).mockImplementation((value) => value);
        (fromNavigator as Mock<typeof fromNavigator>).mockImplementation(
          () => browser,
        );

        const i18n = setupI18n();

        await preloadLocale(i18n);

        expect(i18n.locale).toBe(locale);
      },
    );
  });
});

describe(useLocale, () => {
  it('gets the current locale', () => {
    const { result } = renderHook(useLocale, {
      providers: { i18n: true },
    });

    const [locale] = result.current;

    expect(locale).toBe(fallbackLocale);
  });

  it('loads and sets a new locale', async () => {
    const { result, providers } = renderHook(useLocale, {
      providers: { i18n: true },
    });

    const [locale, setLocale] = result.current;

    expect(locale).toBe('en-GB');
    expect(providers.i18n?.messages).toBe(messagesEnGb);

    await act(() => setLocale('de-DE'));

    const [updatedLocale, updatedSetLocale] = result.current;

    expect(updatedLocale).toBe('de-DE');
    expect(providers.i18n?.messages).toBe(messagesDeDe);
    expect(updatedSetLocale).toBe(setLocale);
  });

  describe('setting an unknown locale', () => {
    mockConsole('error');

    it('logs error if locale is unknown', async () => {
      const { result } = renderHook(useLocale, {
        providers: { i18n: true },
      });

      const [locale, setLocale] = result.current;

      expect(locale).toBe(fallbackLocale);

      await act(() => setLocale('de-AT' as Locale));

      expect(console.error).toBeCalledWith(
        'Unable to load messages for "de-AT"',
      );

      const [updatedLocale] = result.current;

      expect(updatedLocale).toBe(locale);
    });
  });
});
