import { act, mockConsole, renderHook } from '@/testing';
import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';

import { fallbackLocale, type Locale } from './constants.mts';
import { useLocale } from './use-locale';

describe(useLocale, () => {
  it('throws an error without an I18nProvider', () => {
    expect(() => renderHook(useLocale)).toThrow(
      'useLingui hook was used without I18nProvider.',
    );
  });

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
    expect(updatedSetLocale).not.toBe(setLocale);
    expect(updatedSetLocale).toBeTypeOf('function');
  });

  it('preloads a new locale', async () => {
    const { result, providers } = renderHook(useLocale, {
      providers: { i18n: true },
    });

    const [, , preloadLocale] = result.current;

    expect(result.current[0]).toBe('en-GB');
    expect(providers.i18n?.messages).toBe(messagesEnGb);

    await act(() => preloadLocale('de-DE'));

    expect(result.current[0]).toBe('en-GB');
    expect(providers.i18n?.messages).toBe(messagesEnGb);
  });

  describe('setting an unknown locale', () => {
    const consoleError = mockConsole('error');

    it('logs an error and keeps the current locale', async () => {
      const { result } = renderHook(useLocale, {
        providers: { i18n: true },
      });

      const [locale, setLocale] = result.current;

      expect(locale).toBe(fallbackLocale);
      expect(consoleError).not.toHaveBeenCalled();

      // biome-ignore lint/nursery/noUnsafeTypeAssertion: Testing handling of an invalid locale
      await act(() => setLocale('de-AT' as Locale));

      expect(consoleError).toHaveBeenCalledWith(
        'Unable to load messages for de-AT',
      );

      const [updatedLocale] = result.current;

      expect(updatedLocale).toBe(locale);
    });
  });
});
