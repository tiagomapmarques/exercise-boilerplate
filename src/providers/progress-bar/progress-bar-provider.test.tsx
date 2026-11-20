import { use, useEffect } from 'react';
import { createNprogress } from '@mantine/nprogress';

import { act, render, screen } from '@/testing';

import { ProgressBarContext, type ProgressBarContextValue } from './context';
import { ProgressBar } from './progress-bar';
import { ProgressBarProvider } from './progress-bar-provider';
import { useProgressBar } from './use-progress-bar';

vi.mock('@mantine/nprogress', async (importActual) => {
  const original = await importActual<typeof import('@mantine/nprogress')>();
  return {
    ...original,
    createNprogress: vi.fn(original.createNprogress),
  };
});

describe(ProgressBarProvider, () => {
  it('displays its children', () => {
    render(
      <ProgressBarProvider>
        <div data-slot="Content">Mock content</div>
      </ProgressBarProvider>,
      {
        providers: {
          i18n: false,
          mantine: false,
        },
      },
    );

    expect(screen.getByTestId('Content')).toBeVisible();
  });

  it('does not create nProgress more than once', () => {
    const { rerender } = render(<ProgressBarProvider />, {
      providers: {
        i18n: false,
        mantine: false,
      },
    });

    expect(createNprogress).toHaveBeenCalledOnce();

    rerender(<ProgressBarProvider />);

    expect(createNprogress).toHaveBeenCalledOnce();
  });

  it('cleans up nProgress when unmounting', () => {
    const nProgress = createNprogress();
    nProgress[1].cleanup = vi.fn(nProgress[1].cleanup);
    vi.mocked(createNprogress).mockReturnValue(nProgress);

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

    expect(nProgress[1].cleanup).toHaveBeenCalledOnce();
  });

  it('works in tandem with `useProgressBar` and `ProgressBar`', () => {
    const Consumer = () => {
      const { set } = useProgressBar();

      useEffect(() => {
        set(20);
      }, [set]);

      return null;
    };

    render(
      <ProgressBarProvider>
        <ProgressBar label="Mock label" />

        <Consumer />
      </ProgressBarProvider>,
      { providers: { i18n: false } },
    );

    expect(
      screen.getByRole('progressbar', { name: 'Mock label' }),
    ).toHaveAttribute('aria-valuenow', '20');
  });

  it('accepts initial store and actions', () => {
    const [store, actions] = createNprogress();
    const initialActions = {
      ...actions,
      set: vi.fn(actions.set),
      cleanup: vi.fn(actions.cleanup),
    };
    let context: ProgressBarContextValue | undefined;

    const ContextConsumer = () => {
      context = use(ProgressBarContext) ?? undefined;
      return null;
    };

    const { unmount } = render(
      <ProgressBarProvider initialStore={store} initialActions={initialActions}>
        <ContextConsumer />
      </ProgressBarProvider>,
      {
        providers: {
          i18n: false,
          mantine: false,
        },
      },
    );

    expect(createNprogress).toHaveBeenCalledOnce();
    expect(context?.store).toBe(store);
    expect(initialActions.set).not.toHaveBeenCalled();

    act(() => {
      context?.actions.set(20);
    });

    expect(initialActions.set).toHaveBeenCalledExactlyOnceWith(20);
    expect(initialActions.cleanup).not.toHaveBeenCalled();

    unmount();

    expect(initialActions.cleanup).toHaveBeenCalledOnce();
  });

  it('can be used multiple times on a single page', () => {
    const createConsumer = () => {
      let value: ProgressBarContextValue | undefined;

      return {
        consumer: () => {
          value = use(ProgressBarContext) ?? undefined;
          return null;
        },
        get value() {
          return value;
        },
      };
    };

    const Outer = createConsumer();
    const Inner = createConsumer();
    const Sibling = createConsumer();

    render(
      <>
        <ProgressBarProvider>
          <Outer.consumer />

          <ProgressBarProvider>
            <Inner.consumer />
          </ProgressBarProvider>
        </ProgressBarProvider>

        <ProgressBarProvider>
          <Sibling.consumer />
        </ProgressBarProvider>
      </>,
      {
        providers: {
          i18n: false,
          mantine: false,
        },
      },
    );

    expect(Outer.value?.store.getState().progress).toBe(0);
    expect(Inner.value?.store.getState().progress).toBe(0);
    expect(Sibling.value?.store.getState().progress).toBe(0);

    act(() => {
      Outer.value?.actions.set(10);
      Inner.value?.actions.set(30);
    });

    expect(Outer.value?.store.getState().progress).toBe(10);
    expect(Inner.value?.store.getState().progress).toBe(30);
    expect(Sibling.value?.store.getState().progress).toBe(0);
  });
});
