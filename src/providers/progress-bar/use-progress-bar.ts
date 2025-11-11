import { useContext } from 'react';

import { ProgressBarActionsContext } from './contexts';

/** Gets the available actions of a `ProgressBarProvider`. */
export const useProgressBar = () => {
  const actions = useContext(ProgressBarActionsContext);

  if (!actions) {
    throw new Error(
      'useProgressBar hook was used without ProgressBarProvider.',
    );
  }
  return actions;
};
