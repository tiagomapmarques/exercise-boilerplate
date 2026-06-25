import { createContext } from 'react';

import type {
  ProgressBarActions,
  ProgressBarCleanup,
  ProgressBarStore,
} from './types';

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
