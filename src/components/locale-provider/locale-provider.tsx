import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { type Messages, setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import type { Locale } from './constants';
import { loadLocale } from './utilities';

export type LocaleProviderProps = PropsWithChildren<
  | {
      locale?: never;
      messages?: never;
    }
  | {
      locale: Locale;
      messages: Messages;
    }
>;

export const LocaleProvider = ({
  locale,
  messages,
  children,
}: LocaleProviderProps) => {
  const i18nRef = useRef(
    setupI18n(locale && { locale, messages: { [locale]: messages } }),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isNotLoaded = Object.keys(i18nRef.current.messages).length === 0;

    if (isNotLoaded) {
      loadLocale(i18nRef.current)
        .then(() => setReady(true))
        // biome-ignore lint/suspicious/noConsole: Useful error at runtime
        .catch(console.error);
    } else {
      setReady(true);
    }
  }, []);

  return ready ? (
    <I18nProvider i18n={i18nRef.current}>{children}</I18nProvider>
  ) : null;
};
