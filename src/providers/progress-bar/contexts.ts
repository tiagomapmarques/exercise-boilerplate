import { createContext } from 'react';
import type { createNprogress } from '@mantine/nprogress';

export type ProgressBarStore = ReturnType<typeof createNprogress>[0];
export type ProgressBarActions = Omit<
  ReturnType<typeof createNprogress>[1],
  'cleanup'
>;

/** React context for the store of a `ProgressBarProvider`. */
export const ProgressBarStoreContext = createContext<ProgressBarStore | null>(
  null,
);

/** React context for the actions of a `ProgressBarProvider`. */
export const ProgressBarActionsContext =
  createContext<ProgressBarActions | null>(null);
