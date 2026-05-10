import { type PropsWithChildren, useEffect, useState } from 'react';
import { createNprogress } from '@mantine/nprogress';

import {
  type ProgressBarActions,
  type ProgressBarCleanup,
  ProgressBarContext,
  type ProgressBarContextValue,
  type ProgressBarStore,
} from './context';

/** Props for the `ProgressBarProvider` component. */
export type ProgressBarProviderProps = PropsWithChildren<
  | {
      /** Pre-built store to inject. */
      initialStore: ProgressBarStore;
      /** Pre-built actions to inject. */
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
