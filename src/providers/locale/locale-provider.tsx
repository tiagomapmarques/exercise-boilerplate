import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { type I18n, type Messages, setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import type { Locale } from './constants';
import { loadLocale } from './utilities';

/** Props for the `LocaleProvider` component. */
export type LocaleProviderProps = PropsWithChildren<
  {
    /** Rendered while the locale is loading. */
    fallback?: ReactNode;
  } & (
    | {
        /** Pre-loaded locale - skips auto-detection. */
        initialLocale: Locale;
        /** Pre-loaded messages for `initialLocale`. */
        initialMessages: Messages;
      }
    | { initialLocale?: never; initialMessages?: never }
  )
>;

export const LocaleProvider = ({
  initialLocale,
  initialMessages,
  fallback = null,
  children,
}: LocaleProviderProps) => {
  const [i18n, setI18n] = useState<I18n | null>(null);

  useEffect(() => {
    if (i18n) {
      // Single-init: prop changes after mount are ignored on purpose.
      return;
    }

    const initialI18n = setupI18n(
      initialLocale && {
        locale: initialLocale,
        messages: { [initialLocale]: initialMessages },
      },
    );

    if (initialLocale) {
      setI18n(initialI18n);
    } else {
      loadLocale(initialI18n)
        .then(() => setI18n(initialI18n))
        // biome-ignore lint/suspicious/noConsole: Useful error at runtime
        .catch(console.error);
    }
  }, [i18n, initialLocale, initialMessages]);

  return i18n ? <I18nProvider i18n={i18n}>{children}</I18nProvider> : fallback;
};
