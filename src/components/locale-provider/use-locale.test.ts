import { act, mockConsole, renderHook } from '@/testing';
import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';

import { fallbackLocale, type Locale } from './constants';
import { useLocale } from './use-locale';

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
    const consoleError = mockConsole('error');

    it('logs error if locale is unknown', async () => {
      const { result } = renderHook(useLocale, {
        providers: { i18n: true },
      });

      const [locale, setLocale] = result.current;

      expect(locale).toBe(fallbackLocale);

      await act(() => setLocale('de-AT' as Locale));

      expect(consoleError).toBeCalledWith('Unable to load messages for de-AT');

      const [updatedLocale] = result.current;

      expect(updatedLocale).toBe(locale);
    });
  });
});
