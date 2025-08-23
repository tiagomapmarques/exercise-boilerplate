import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { loadLocale } from './utilities';

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const i18nRef = useRef(setupI18n());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadLocale(i18nRef.current).then(() => {
      setReady(true);
    });
  }, []);

  return ready ? (
    <I18nProvider i18n={i18nRef.current}>{children}</I18nProvider>
  ) : null;
};
