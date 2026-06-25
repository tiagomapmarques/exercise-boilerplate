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
