import type { I18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';

import {
  fallbackLocale,
  type Language,
  type Locale,
  languageMap,
  languages,
  locales,
} from './constants';

/**
 * Fetches the translations for the specified Locale.
 *
 * If given an `i18n` instance, it will load the fetched Messages onto the
 * `i18n` instance and activate the Locale.
 */
export const fetchAndActivateLocale = async (locale: Locale, i18n?: I18n) => {
  try {
    const { messages } = await import(`../../locales/${locale}.po`);

    i18n?.load(locale, messages);
    i18n?.activate(locale);
  } catch {
    // biome-ignore lint/suspicious/noConsole: Useful error at runtime
    console.error(`Unable to load messages for ${locale}`);
  }
};

const isLocale = (locale = ''): locale is Locale => {
  return Boolean(locale) && locales.includes(locale as Locale);
};

const isLanguage = (localeOrLanguage = ''): localeOrLanguage is Language => {
  const language = localeOrLanguage.split('-')[0];
  return Boolean(language) && languages.includes(language as Language);
};

const getInitialLocale = (locale?: string) => {
  const userPreference = locale || detect(fromNavigator()) || undefined;

  if (isLocale(userPreference)) {
    return userPreference;
  }
  if (isLanguage(userPreference)) {
    return languageMap[userPreference.split('-')[0] as Language];
  }
  return fallbackLocale;
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
