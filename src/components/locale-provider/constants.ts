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
