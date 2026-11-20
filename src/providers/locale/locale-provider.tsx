import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { type I18n, type Messages, setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import type { Locale } from './constants.mts';
import { loadLocale } from './utilities';

/** Props for the `LocaleProvider` component. */
export type LocaleProviderProps = PropsWithChildren<
  (
    | {
        /** Pre-loaded locale - skips auto-detection. */
        initialLocale: Locale;
        /** Pre-loaded messages for `initialLocale`. */
        initialMessages: Messages;
      }
    | { initialLocale?: never; initialMessages?: never }
  ) & {
    /** Rendered while the locale is loading. */
    fallback?: ReactNode;
  }
>;

export const LocaleProvider = ({
  initialLocale,
  initialMessages,
  fallback = null,
  children,
}: LocaleProviderProps) => {
  const [i18n, setI18n] = useState<I18n | null>(() => {
    return initialLocale
      ? setupI18n({
          locale: initialLocale,
          messages: { [initialLocale]: initialMessages },
        })
      : null;
  });

  useEffect(() => {
    if (i18n) {
      return;
    }

    const initialI18n = setupI18n();
    loadLocale(initialI18n)
      .then(() => setI18n(initialI18n))
      // biome-ignore lint/suspicious/noConsole: Useful error at runtime
      .catch(console.error);
  }, [i18n]);

  return i18n ? <I18nProvider i18n={i18n}>{children}</I18nProvider> : fallback;
};
