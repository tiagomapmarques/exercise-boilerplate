import { setupI18n } from '@lingui/core';

import { messages } from '@/locales/de-DE.po';
import { act, disableConsoleError, renderAppHook } from '@/testing';

import { LanguageMap, Locale, localeLabels, useLocale } from './locale';

describe('Locale and language maps', () => {
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
});

describe(useLocale, () => {
  test('gets the current locale', () => {
    const { result } = renderAppHook(() => useLocale(), {
      providers: { i18n: true },
    });

    expect(result.current[0]).toBe('en-GB');
  });

  test('loads and sets a new locale', async () => {
    const i18n = setupI18n({
      locale: 'en-GB',
      messages: { 'en-GB': messages },
    });
    const i18nLoad = vi.spyOn(i18n, 'load');

    const { result } = renderAppHook(() => useLocale(), {
      providers: { i18n: { i18n } },
    });

    expect(i18nLoad).not.lastCalledWith('de-DE', messages);

    await act(async () => {
      await result.current[1]('de-DE');
    });

    expect(result.current[0]).toBe('de-DE');
    expect(i18nLoad).lastCalledWith('de-DE', messages);
  });

  describe('setting an unknown locale', () => {
    disableConsoleError();

    test('log error if locale is unknown', async () => {
      const { result } = renderAppHook(() => useLocale(), {
        providers: { i18n: true },
      });

      await act(async () => {
        await result.current[1]('de-AT' as Locale);
      });

      expect(console.error).toBeCalledWith(
        'Unable to load messages from "../locales/de-AT"',
      );

      expect(result.current[0]).toBe('en-GB');
    });
  });
});
