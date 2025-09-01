import { useEffect, useRef } from 'react';
import { useLingui } from '@lingui/react';
import { createNprogress, NavigationProgress } from '@mantine/nprogress';
import { useRouter } from '@tanstack/react-router';

import classes from './router-progress.module.css';

export const RouterProgress = () => {
  const { i18n } = useLingui();
  const router = useRouter();
  const [store, { start, complete }] = useRef(createNprogress()).current;

  useEffect(() => {
    router.subscribe('onBeforeNavigate', start);
    router.subscribe('onResolved', complete);
  }, [router, start, complete]);

  return (
    <NavigationProgress
      store={store}
      className={classes.RouterProgress}
      aria-label={i18n.t({ id: 'messages.loading' })}
    />
  );
};
