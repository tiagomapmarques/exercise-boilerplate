import { useEffect } from 'react';
import { createNprogress } from '@mantine/nprogress';

import { type Mock, render, screen } from '@/testing';

import { ProgressBar } from './progress-bar';
import {
  ProgressBarProvider,
  type ProgressBarProviderProps,
} from './progress-bar-provider';
import { useProgressBar } from './use-progress-bar';

vi.mock('@mantine/nprogress', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/nprogress')>();
  return {
    ...original,
    createNprogress: vi.fn(original.createNprogress),
  };
});

describe(ProgressBarProvider, () => {
  it('displays its children', () => {
    render(
      <ProgressBarProvider>
        <div data-slot="Content" />
      </ProgressBarProvider>,
      {
        providers: {
          i18n: false,
          mantine: false,
        },
      },
    );

    expect(screen.getByTestId('Content')).not.toBeVisible();
  });

  it('does not create nProgress more than once', () => {
    const { rerender } = render(<ProgressBarProvider />, {
      providers: {
        i18n: false,
        mantine: false,
      },
    });

    expect(createNprogress).toHaveBeenCalledTimes(1);

    rerender(<ProgressBarProvider />);

    expect(createNprogress).toHaveBeenCalledTimes(1);
  });

  it('cleans up nProgress when unmounting', () => {
    const nProgress = createNprogress();
    nProgress[1].cleanup = vi.fn(nProgress[1].cleanup);
    (createNprogress as Mock<typeof createNprogress>).mockReturnValue(
      nProgress,
    );

    const { rerender, unmount } = render(<ProgressBarProvider />, {
      providers: {
        i18n: false,
        mantine: false,
      },
    });

    expect(nProgress[1].cleanup).not.toHaveBeenCalled();

    rerender(<ProgressBarProvider />);

    expect(nProgress[1].cleanup).not.toHaveBeenCalled();

    unmount();

    expect(nProgress[1].cleanup).toHaveBeenCalledTimes(1);
  });

  it('works in tandem with `useProgressBar` and `ProgressBar`', () => {
    const Consumer = () => {
      const progressBar = useProgressBar();
      return (
        <>
          <ProgressBar label="Mock label" />
          <div
            data-slot="Content"
            data-keys={Object.keys(progressBar).length}
          />
        </>
      );
    };

    render(
      <ProgressBarProvider>
        <Consumer />
      </ProgressBarProvider>,
      { providers: { i18n: false } },
    );

    expect(screen.getByTestId('Content').dataset.keys).toEqual('7');
    expect(
      screen.getByRole('progressbar', { name: 'Mock label' }),
    ).not.toBeVisible();
  });

  it('accepts initial store and actions', () => {
    const Consumer = () => {
      const progressBar = useProgressBar();
      return (
        <div
          data-slot="Content"
          data-mock-action={(progressBar as Record<string, unknown>).mockAction}
        />
      );
    };

    const customStore = { mockKey: 'mock-value' };
    const customActions = { mockAction: 'mock-function', cleanup: vi.fn() };

    const { unmount } = render(
      <ProgressBarProvider
        initialStore={
          customStore as unknown as Required<ProgressBarProviderProps>['initialStore']
        }
        initialActions={
          customActions as unknown as Required<ProgressBarProviderProps>['initialActions']
        }
      >
        <Consumer />
      </ProgressBarProvider>,
      {
        providers: {
          i18n: false,
          mantine: false,
        },
      },
    );

    expect(screen.getByTestId('Content').dataset.mockAction).toBe(
      customActions.mockAction,
    );

    expect(customActions.cleanup).not.toHaveBeenCalled();

    unmount();

    expect(customActions.cleanup).toHaveBeenCalledTimes(1);
  });

  it('can be used multiple times on a single page', () => {
    const nProgress1 = createNprogress();
    const nProgress2 = createNprogress();
    const nProgress3 = createNprogress();

    const Consumer = ({ state }: { state: number }) => {
      const { set } = useProgressBar();
      useEffect(() => {
        set(state);
      }, [set, state]);
      return null;
    };

    render(
      <>
        <ProgressBarProvider
          initialStore={nProgress1[0]}
          initialActions={nProgress1[1]}
        >
          <Consumer state={10} />

          <ProgressBarProvider
            initialStore={nProgress3[0]}
            initialActions={nProgress3[1]}
          >
            <Consumer state={30} />
          </ProgressBarProvider>
        </ProgressBarProvider>

        <ProgressBarProvider
          initialStore={nProgress2[0]}
          initialActions={nProgress2[1]}
        >
          <Consumer state={20} />
        </ProgressBarProvider>
      </>,
      {
        providers: {
          i18n: false,
          mantine: false,
        },
      },
    );

    expect(nProgress1[0].getState().progress).toBe(10);
    expect(nProgress2[0].getState().progress).toBe(20);
    expect(nProgress3[0].getState().progress).toBe(30);
  });
});
