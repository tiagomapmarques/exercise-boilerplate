import { type PropsWithChildren, useEffect, useState } from 'react';
import { type I18n, type Messages, setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import type { Locale } from './constants';
import { loadLocale } from './utilities';

export type LocaleProviderProps = PropsWithChildren<
  | { initialLocale: Locale; initialMessages: Messages }
  | { initialLocale?: never; initialMessages?: never }
>;

export const LocaleProvider = ({
  initialLocale,
  initialMessages,
  children,
}: LocaleProviderProps) => {
  const [i18n, setI18n] = useState<I18n | null>(null);

  useEffect(() => {
    if (!i18n) {
      const initialI18n = setupI18n(
        initialLocale && {
          locale: initialLocale,
          messages: { [initialLocale]: initialMessages },
        },
      );

      if (Object.keys(initialMessages || {}).length === 0) {
        loadLocale(initialI18n)
          .then(() => setI18n(initialI18n))
          // biome-ignore lint/suspicious/noConsole: Useful error at runtime
          .catch(console.error);
      } else {
        setI18n(initialI18n);
      }
    }
  }, [i18n, initialLocale, initialMessages]);

  return i18n ? <I18nProvider i18n={i18n}>{children}</I18nProvider> : null;
};
