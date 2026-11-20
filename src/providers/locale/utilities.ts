import type { I18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';

import {
  fallbackLocale,
  type Locale,
  languageMap,
  languages,
  locales,
} from './constants.mts';

/** Fetches the messages for a locale, then loads and activates them on `i18n` when one is given. */
export const fetchAndActivateLocale = async (locale: Locale, i18n?: I18n) => {
  try {
    const { messages } = await import(`../../locales/${locale}.po`);

    i18n?.load(locale, messages);
    i18n?.activate(locale);
  } catch {
    // biome-ignore lint/suspicious/noConsole: The app renders without translations or with already loaded translations rather than crashing
    console.error(`Unable to load messages for ${locale}`);
  }
};

const isLocale = (locale = ''): locale is Locale => {
  // biome-ignore lint/nursery/useIncludes: `includes()` needs `locale` already narrowed to `Locale`
  return Boolean(locale) && locales.some((item) => item === locale);
};

const getLocaleFromLanguage = (localeOrLanguage = '') => {
  const [language] = localeOrLanguage.split('-');
  const validLanguage = languages.find((item) => item === language);
  return validLanguage ? languageMap[validLanguage] : undefined;
};

const getInitialLocale = (locale?: string) => {
  // biome-ignore lint/nursery/useNullishCoalescing: Purposefully considering empty strings as nullish as they aren't valid
  const userPreference = locale || detect(fromNavigator()) || undefined;

  if (isLocale(userPreference)) {
    return userPreference;
  }
  return getLocaleFromLanguage(userPreference) ?? fallbackLocale;
};

/**
 * Loads Messages for the Locale suggested by the browser (falls back to
 * `fallbackLocale`).
 *
 * If an `i18n` instance is provided, it will use its Locale, load the Messages
 * onto the instance and (re-)activate the Locale. If no Locale was set in the
 * `i18n` instance, it will use the Locale suggested by the browser instead
 * (still with `fallbackLocale` as a fallback).
 */
export const loadLocale = async (i18n?: I18n) => {
  await fetchAndActivateLocale(getInitialLocale(i18n?.locale), i18n);
};
