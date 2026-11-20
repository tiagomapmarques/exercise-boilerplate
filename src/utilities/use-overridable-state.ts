import { useCallback, useEffect, useRef, useState } from 'react';

/** Options for the `useOverridableState` hook. */
export type UseOverridableStateOptions<External, State> = {
  /** External value this state is derived from and resets to whenever it changes. */
  external: External;
  /** Derives state from `external`, on mount and whenever `external` changes by reference. */
  toState: (external: External) => State;
  /** Called with the new state whenever it is changed internally. */
  onChange?: (state: State) => void;
};

/** State that is owned locally but can be updated via an external variable. */
export const useOverridableState = <External, State>({
  external,
  toState,
  onChange,
}: UseOverridableStateOptions<External, State>) => {
  const [previousExternal, setPreviousExternal] = useState(external);
  const [state, setState] = useState<State>(() => toState(external));
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  if (external !== previousExternal) {
    setPreviousExternal(external);
    setState(toState(external));
  }

  const handleChange = useCallback((next: State) => {
    setState(next);
    onChangeRef.current?.(next);
  }, []);

  return [state, handleChange] as const;
};
