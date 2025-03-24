import { I18n } from '@lingui/core';
import { detect, fromNavigator } from '@lingui/detect-locale';
import { useLingui } from '@lingui/react';
import { useCallback } from 'react';

import { defaultLocale } from '@/i18n';

/** Maps Languages to their default Locales */
export const LanguageMap = {
  en: 'en-GB',
  de: 'de-DE',
} as const;

/** Supported language */
export type Language = keyof typeof LanguageMap;

/** Maps Locale to their labels */
export const localeLabels = {
  'en-GB': 'English (GB)',
  'de-DE': 'Deutsch (DE)',
} as const;

/** Supported locale */
export type Locale = keyof typeof localeLabels;

export const locales = Object.keys(localeLabels) as Locale[];

export const languages = Object.keys(LanguageMap) as Language[];

export const loadMessages = async (localI18n: I18n, locale: Locale) => {
  try {
    const { messages } = await import(`../locales/${locale}.po`);

    localI18n.load(locale, messages);
    localI18n.activate(locale);
  } catch {
    console.error(`Unable to load messages from "../locales/${locale}"`);
  }
};

export const useLocale = () => {
  const { i18n: localI18n } = useLingui();

  const setLocale = useCallback(
    (locale: Locale) => loadMessages(localI18n, locale),
    [],
  );

  return [localI18n.locale as Locale, setLocale] as const;
};

const isLocale = (locale = ''): locale is Locale => {
  return !!locale && !!locales.includes(locale as Locale);
};

const isLanguage = (locale = ''): locale is Language => {
  const language = locale.split('-')[0];
  return !!language && !!languages.includes(language as Language);
};

export const getInitialLocale = () => {
  const userPreference = detect(fromNavigator()) || undefined;

  if (isLocale(userPreference)) {
    return userPreference;
  }
  if (isLanguage(userPreference)) {
    return LanguageMap[userPreference.split('-')[0] as Language];
  }
  return defaultLocale;
};
