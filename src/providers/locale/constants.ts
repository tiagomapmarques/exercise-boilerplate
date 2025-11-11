/** Maps Languages to their default Locales. */
export const languageMap = {
  en: 'en-GB',
  fr: 'fr-FR',
  de: 'de-DE',
} as const;

/** Maps Locale to their labels. */
export const localeLabels = {
  'en-GB': { label: 'English (GB)', country: 'Great Britain', code: 'GB' },
  'fr-FR': { label: 'Français (FR)', country: 'France', code: 'FR' },
  'de-DE': { label: 'Deutsch (DE)', country: 'Deutschland', code: 'DE' },
} as const;

/** Supported locale. */
export type Locale = keyof typeof localeLabels;

/** List of supported locales. */
export const locales = Object.keys(localeLabels) as Locale[];

/** Supported language. */
export type Language = keyof typeof languageMap;

/** List of supported languages. */
export const languages = Object.keys(languageMap) as Language[];

/** Supported country. */
export type Country = (typeof localeLabels)[Locale]['code'];

/** List of supported countries. */
export const countries = Object.values(localeLabels).map(
  ({ code }) => code,
) as Country[];

/** Fallback locale for the app. */
export const fallbackLocale = 'en-GB' satisfies Locale;
