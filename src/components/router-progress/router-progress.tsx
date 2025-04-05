import { useEffect } from 'react';
import { useLingui } from '@lingui/react';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { useRouter } from '@tanstack/react-router';
import { throttle } from 'throttle-debounce';

const nprogressComplete = throttle(50, () => {
  requestAnimationFrame(() => {
    nprogress.complete();
  });
});

export const RouterProgress = () => {
  const router = useRouter();
  const { i18n } = useLingui();

  useEffect(() => {
    router.subscribe('onBeforeNavigate', () => {
      nprogress.start();
    });
    router.subscribe('onResolved', () => {
      nprogressComplete();
    });
  }, [router]);

  return (
    <NavigationProgress
      aria-label={i18n.t({ id: 'boilerplate.header.page-loading' })}
    />
  );
};
