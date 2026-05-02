import { useContext } from 'react';
import { NavigationProgress } from '@mantine/nprogress';

import { ProgressBarContext } from './contexts';
import classes from './progress-bar.module.css';

export type ProgressBarProps = {
  label: string;
};

export const ProgressBar = ({ label }: ProgressBarProps) => {
  const value = useContext(ProgressBarContext);

  if (!value?.store) {
    throw new Error(
      'ProgressBar component was used without ProgressBarProvider.',
    );
  }

  return (
    <NavigationProgress
      store={value.store}
      className={classes.NavigationProgress}
      aria-label={label}
    />
  );
};
