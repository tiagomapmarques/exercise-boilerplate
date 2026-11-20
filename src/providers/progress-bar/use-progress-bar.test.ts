import { act, renderHook } from '@/testing';

import { useProgressBar } from './use-progress-bar';

describe(useProgressBar, () => {
  it('throws an error without a ProgressBarProvider', () => {
    expect(() => renderHook(useProgressBar)).toThrow(
      'useProgressBar hook was used without ProgressBarProvider.',
    );
  });

  it('gets actions for the progress bar', () => {
    const { result, providers } = renderHook(useProgressBar, {
      providers: { progressBar: true },
    });

    expect(result.current).toBe(providers.progressBar?.actions);
  });

  it('changes the state of the progress bar', () => {
    const { result, providers } = renderHook(useProgressBar, {
      providers: { progressBar: true },
    });
    const store = providers.progressBar?.store;

    expect(store?.getState()).toMatchObject({ mounted: false, progress: 0 });

    act(() => {
      result.current.set(20);
    });

    expect(store?.getState()).toMatchObject({ mounted: true, progress: 20 });

    act(() => {
      result.current.complete();
    });

    expect(store?.getState()).toMatchObject({ mounted: true, progress: 100 });
  });
});
