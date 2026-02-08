import { type PropsWithChildren, useEffect, useState } from 'react';
import { createNprogress } from '@mantine/nprogress';

import {
  type ProgressBarActions,
  ProgressBarActionsContext,
  type ProgressBarStore,
  ProgressBarStoreContext,
} from './contexts';

export type ProgressBarProviderProps = PropsWithChildren<
  | {
      initialStore: ProgressBarStore;
      initialActions: ProgressBarActions & { cleanup?: () => void };
    }
  | { initialStore?: never; initialActions?: never }
>;

export const ProgressBarProvider = ({
  initialStore,
  initialActions,
  children,
}: ProgressBarProviderProps) => {
  const { cleanup: initialCleanup, ...rest } = initialActions || {};

  const [{ store, actions, cleanup }, setState] = useState({
    store: initialStore,
    actions: initialActions ? (rest as ProgressBarActions) : undefined,
    cleanup: initialCleanup,
  });

  if (!(store && actions)) {
    const nProgress = createNprogress();
    const { cleanup: nProgressCleanup, ...other } = nProgress[1];

    setState({
      store: nProgress[0],
      actions: other,
      cleanup: nProgressCleanup,
    });
  }

  useEffect(() => {
    return () => cleanup?.();
  }, [cleanup]);

  return store && actions && cleanup ? (
    <ProgressBarStoreContext.Provider value={store}>
      <ProgressBarActionsContext.Provider value={actions}>
        {children}
      </ProgressBarActionsContext.Provider>
    </ProgressBarStoreContext.Provider>
  ) : null;
};
