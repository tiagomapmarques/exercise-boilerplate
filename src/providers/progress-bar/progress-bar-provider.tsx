import { type PropsWithChildren, useEffect, useState } from 'react';
import { createNprogress } from '@mantine/nprogress';

import {
  type ProgressBarActions,
  type ProgressBarCleanup,
  ProgressBarContext,
  type ProgressBarContextValue,
  type ProgressBarStore,
} from './contexts';

export type ProgressBarProviderProps = PropsWithChildren<
  | {
      initialStore: ProgressBarStore;
      initialActions: ProgressBarActions & { cleanup: ProgressBarCleanup };
    }
  | { initialStore?: never; initialActions?: never }
>;

export const ProgressBarProvider = ({
  initialStore,
  initialActions,
  children,
}: ProgressBarProviderProps) => {
  const [value] = useState<ProgressBarContextValue>(() => {
    const [store, { cleanup, ...actions }] =
      initialStore && initialActions
        ? [initialStore, initialActions]
        : createNprogress();

    return { store, actions, cleanup };
  });

  useEffect(() => {
    return () => value.cleanup();
  }, [value.cleanup]);

  return (
    <ProgressBarContext.Provider value={value}>
      {children}
    </ProgressBarContext.Provider>
  );
};
