import { createContext } from 'react';
import type { createNprogress } from '@mantine/nprogress';

export type ProgressBarStore = ReturnType<typeof createNprogress>[0];
export type ProgressBarActions = Omit<
  ReturnType<typeof createNprogress>[1],
  'cleanup'
>;
export type ProgressBarCleanup = ReturnType<
  typeof createNprogress
>[1]['cleanup'];

/** React context for a `ProgressBarProvider`. */
export type ProgressBarContextValue = {
  store: ProgressBarStore;
  actions: ProgressBarActions;
  cleanup: ProgressBarCleanup;
};

export const ProgressBarContext = createContext<ProgressBarContextValue | null>(
  null,
);
