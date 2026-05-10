/** Maps Languages to their default Locales. */
export const languageMap = {
  en: 'en-GB',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
  it: 'it-IT',
} as const;

/** Maps each locale to its display label, country name, and flag code. */
export const localeMetadata = {
  'en-GB': { label: 'English (GB)', country: 'Great Britain', code: 'GB' },
  'fr-FR': { label: 'Français (FR)', country: 'France', code: 'FR' },
  'de-DE': { label: 'Deutsch (DE)', country: 'Deutschland', code: 'DE' },
  'es-ES': { label: 'Español (ES)', country: 'España', code: 'ES' },
  'it-IT': { label: 'Italiano (IT)', country: 'Italia', code: 'IT' },
} as const;

/** Supported locale. */
export type Locale = keyof typeof localeMetadata;

/** List of supported locales. */
export const locales = Object.keys(localeMetadata) as Locale[];

/** Supported language. */
export type Language = keyof typeof languageMap;

/** List of supported languages. */
export const languages = Object.keys(languageMap) as Language[];

/** Supported country. */
export type Country = (typeof localeMetadata)[Locale]['code'];

/** List of supported countries. */
export const countries = Object.values(localeMetadata).map(
  ({ code }) => code,
) as Country[];

/** Fallback locale for the app. */
export const fallbackLocale = 'en-GB' satisfies Locale;
