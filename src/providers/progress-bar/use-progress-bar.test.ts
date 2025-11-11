import { createNprogress } from '@mantine/nprogress';

import { act, renderHook } from '@/testing';

import { useProgressBar } from './use-progress-bar';

describe(useProgressBar, () => {
  it('throws an error without an ProgressBarProvider', () => {
    expect(() => renderHook(useProgressBar)).toThrowError(
      'useProgressBar hook was used without ProgressBarProvider.',
    );
  });

  it('gets actions for the progress bar', () => {
    const { result } = renderHook(useProgressBar, {
      providers: { progressBar: true },
    });

    expect(result.current.start).toBeTypeOf('function');
    expect(result.current.complete).toBeTypeOf('function');
  });

  it('changes the state of the progress bar', () => {
    const [store, actions] = createNprogress();
    const initialState = {
      ...store.getState(),
      timeouts: expect.any(Array),
    };

    const { result } = renderHook(useProgressBar, {
      providers: { progressBar: { store, actions } },
    });

    expect(store.getState()).toEqual(initialState);

    act(() => {
      result.current.set(20);
    });

    expect(store.getState()).toEqual({
      ...initialState,
      mounted: true,
      progress: 20,
    });

    act(() => {
      result.current.complete();
    });

    expect(store.getState()).toEqual({
      ...initialState,
      mounted: true,
      progress: 100,
    });
  });
});
