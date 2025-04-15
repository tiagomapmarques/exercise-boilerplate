import { useCallback } from 'react';
import { type I18n, setupI18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';
import { useLingui } from '@lingui/react';

export type { I18n };

const appI18n = setupI18n();

/** Gets the i18n instance for the app. */
export const getAppI18n = () => appI18n;

/** Maps Languages to their default Locales. */
export const LanguageMap = {
  en: 'en-GB',
  fr: 'fr-FR',
  de: 'de-DE',
} as const;

/** Supported language. */
export type Language = keyof typeof LanguageMap;

/** Maps Locale to their labels. */
export const localeLabels = {
  'en-GB': { label: 'English (GB)', country: 'Great Britain' },
  'fr-FR': { label: 'Français (FR)', country: 'France' },
  'de-DE': { label: 'Deutsch (DE)', country: 'Deutschland' },
} as const;

/** Supported locale. */
export type Locale = keyof typeof localeLabels;

/** List of supported locales. */
export const locales = Object.keys(localeLabels) as Locale[];

/** List of supported languages. */
export const languages = Object.keys(LanguageMap) as Language[];

/** Fallback locale for the app. */
export const fallbackLocale = 'en-GB' satisfies Locale;

const loadAndActivateLocale = async (i18n: I18n, locale: Locale) => {
  try {
    const { messages } = await import(`../locales/${locale}.po`);

    i18n.load(locale, messages);
    i18n.activate(locale);
  } catch {
    console.error(`Unable to load messages from "../locales/${locale}"`);
  }
};

/** Gets and sets the locale in the app i18n provider. */
export const useLocale = () => {
  const { i18n } = useLingui();

  const setLocale = useCallback(
    async (locale: Locale) => {
      await loadAndActivateLocale(i18n, locale);
    },
    [i18n],
  );

  return [i18n.locale as Locale, setLocale] as const;
};

const isLocale = (locale = ''): locale is Locale => {
  return !!locale && !!locales.includes(locale as Locale);
};

const isLanguage = (localeOrLanguage = ''): localeOrLanguage is Language => {
  const language = localeOrLanguage.split('-')[0];
  return !!language && !!languages.includes(language as Language);
};

const getInitialLocale = () => {
  const userPreference = detect(fromNavigator()) || undefined;

  if (isLocale(userPreference)) {
    return userPreference;
  }
  if (isLanguage(userPreference)) {
    return LanguageMap[userPreference.split('-')[0] as Language];
  }
  return fallbackLocale;
};

/**
 * Preloads a locale onto an i18n instance.
 *
 * Be default, it tries to guess the locale from the browser settings (falls
 * back to the `fallbackLocale`).
 */
export const preloadLocale = async (
  i18n: I18n,
  locale = getInitialLocale(),
) => {
  await loadAndActivateLocale(i18n, locale);
};
