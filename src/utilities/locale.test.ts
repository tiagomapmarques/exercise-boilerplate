import type { Mock } from 'vitest';
import { I18n, setupI18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';

import { act, disableConsoleError, renderAppHook } from '@/testing';
import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';

import {
  fallbackLocale,
  getAppI18n,
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
  test('defines labels for all locales', () => {
    expect(localeLabels).toStrictEqual({
      'en-GB': expect.stringMatching(/./),
      'de-DE': expect.stringMatching(/./),
    });
  });

  test('defines default locales for all languages', () => {
    const anyLocale = /(en-GB)|(de-DE)/;

    expect(LanguageMap).toStrictEqual({
      en: expect.stringMatching(anyLocale),
      de: expect.stringMatching(anyLocale),
    });
  });

  test('defines a valid default locale', () => {
    expect(locales.includes(fallbackLocale)).toBeTruthy();
  });
});

describe(getAppI18n, () => {
  test('gets an I18n instance', () => {
    const i18n = getAppI18n();

    expect(i18n).toBeInstanceOf(I18n);
  });
});

describe(preloadLocale, () => {
  test('loads en-GB messages', async () => {
    const i18n = setupI18n();

    await preloadLocale(i18n, 'en-GB');

    expect(i18n.locale).toBe('en-GB');
    expect(i18n.messages).toBe(messagesEnGb);
  });

  test('loads de-DE messages', async () => {
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
      ${'de-DE'}   | ${'de-DE'}
      ${'de-AT'}   | ${'de-DE'}
      ${'uk-UA'}   | ${'en-GB'}
      ${'uk'}      | ${'en-GB'}
    `(
      'browser with $browser locale, initial locale becomes $locale',
      async ({ browser, locale }) => {
        (detect as Mock<typeof detect>).mockImplementation(
          (firstOption) => firstOption,
        );
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
  test('gets the current locale', () => {
    const { result } = renderAppHook(() => useLocale(), {
      providers: { i18n: true },
    });

    const [locale] = result.current;

    expect(locale).toBe(fallbackLocale);
  });

  test('loads and sets a new locale', async () => {
    const { result, providers } = renderAppHook(() => useLocale(), {
      providers: { i18n: true },
    });

    const [locale, setLocale] = result.current;

    expect(locale).toBe('en-GB');
    expect(providers.i18n?.messages).toBe(messagesEnGb);

    await act(async () => {
      await setLocale('de-DE');
    });

    const [updatedLocale, updatedSetLocale] = result.current;

    expect(updatedLocale).toBe('de-DE');
    expect(providers.i18n?.messages).toBe(messagesDeDe);
    expect(updatedSetLocale).toBe(setLocale);
  });

  describe('setting an unknown locale', () => {
    disableConsoleError();

    test('log error if locale is unknown', async () => {
      const { result } = renderAppHook(() => useLocale(), {
        providers: { i18n: true },
      });

      const [locale, setLocale] = result.current;

      expect(locale).toBe(fallbackLocale);

      await act(async () => {
        await setLocale('de-AT' as Locale);
      });

      expect(console.error).toBeCalledWith(
        'Unable to load messages from "../locales/de-AT"',
      );

      const [updatedLocale] = result.current;

      expect(updatedLocale).toBe(locale);
    });
  });
});
