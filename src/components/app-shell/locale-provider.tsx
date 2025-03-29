import { PropsWithChildren, useEffect, useState } from 'react';
import { I18nProvider } from '@lingui/react';

import { getAppI18n } from '@/utilities/locale';

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const [ready, setReady] = useState(false);
  const appI18n = getAppI18n();

  useEffect(() => {
    let animationFrameTimer: number;

    const checkMessages = () => {
      if (Object.keys(appI18n.messages).length) {
        setReady(true);
        return;
      }
      animationFrameTimer = requestAnimationFrame(checkMessages);
    };
    checkMessages();

    return () => {
      cancelAnimationFrame(animationFrameTimer);
    };
  });

  return ready ? <I18nProvider i18n={appI18n}>{children}</I18nProvider> : null;
};
