import { useCallback } from 'react';
import { useLingui } from '@lingui/react';

import type { Locale } from './constants';
import { fetchAndActivateLocale } from './utilities';

/** Gets and sets the locale of a `LocaleProvider`. */
export const useLocale = () => {
  const { i18n } = useLingui();

  const setLocale = useCallback(
    async (locale: Locale) => {
      await fetchAndActivateLocale(locale, i18n);
    },
    [i18n],
  );

  const preloadLocale = useCallback(async (locale: Locale) => {
    await fetchAndActivateLocale(locale);
  }, []);

  return [i18n.locale as Locale, setLocale, preloadLocale] as const;
};
