import { useContext } from 'react';

import { ProgressBarContext } from './context';

/** Gets the available actions of a `ProgressBarProvider`. */
export const useProgressBar = () => {
  const value = useContext(ProgressBarContext);

  if (!value?.actions) {
    throw new Error(
      'useProgressBar hook was used without ProgressBarProvider.',
    );
  }
  return value.actions;
};
