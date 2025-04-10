import { useEffect } from 'react';
import { useLingui } from '@lingui/react';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { Throttler } from '@tanstack/react-pacer';
import { useRouter } from '@tanstack/react-router';

import './router-progress.css';

const nprogressComplete = new Throttler(nprogress.complete, {
  trailing: false,
  wait: 50,
});

export const RouterProgress = () => {
  const router = useRouter();
  const { i18n } = useLingui();

  useEffect(() => {
    router.subscribe('onBeforeNavigate', () => {
      nprogress.start();
    });
    router.subscribe('onResolved', () => {
      requestAnimationFrame(() => {
        nprogressComplete.maybeExecute();
      });
    });
  }, [router]);

  return (
    <NavigationProgress
      aria-label={i18n.t({ id: 'boilerplate.header.page-loading' })}
    />
  );
};
