import { useContext } from 'react';
import { NavigationProgress } from '@mantine/nprogress';

import { ProgressBarStoreContext } from './contexts';
import classes from './progress-bar.module.css';

export type ProgressBarProps = {
  label: string;
};

export const ProgressBar = ({ label }: ProgressBarProps) => {
  const store = useContext(ProgressBarStoreContext);

  if (!store) {
    throw new Error(
      'ProgressBar component was used without ProgressBarProvider.',
    );
  }

  return (
    <NavigationProgress
      store={store}
      className={classes.NavigationProgress}
      aria-label={label}
    />
  );
};
