import { createContext } from 'react';
import type { createNprogress } from '@mantine/nprogress';

/** Store returned by a `ProgressBarProvider`. */
export type ProgressBarStore = ReturnType<typeof createNprogress>[0];
/** Actions returned by a `ProgressBarProvider`. */
export type ProgressBarActions = Omit<
  ReturnType<typeof createNprogress>[1],
  'cleanup'
>;
/** Cleanup function returned by a `ProgressBarProvider`. */
export type ProgressBarCleanup = ReturnType<
  typeof createNprogress
>[1]['cleanup'];

/** React context value for a `ProgressBarProvider`. */
export type ProgressBarContextValue = {
  /** Mantine NProgress store. */
  store: ProgressBarStore;
  /** Actions to control the progress bar. */
  actions: ProgressBarActions;
  /** Cleanup function to destroy the store on unmount. */
  cleanup: ProgressBarCleanup;
};

/** React context for a `ProgressBarProvider`. */
export const ProgressBarContext = createContext<ProgressBarContextValue | null>(
  null,
);
