import { nprogress } from '@mantine/nprogress';
import {
  type AnyRouter,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';

import { act, ControlledPromise, render, screen, waitFor } from '@/testing';

import { RouterProgress } from './router-progress';

vi.mock('@mantine/nprogress', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/nprogress')>();
  return {
    ...original,
    nprogress: {
      ...original.nprogress,
      start: vi.fn(original.nprogress.start),
      complete: vi.fn(original.nprogress.complete),
    },
  };
});

describe(RouterProgress, () => {
  let onResolved: ControlledPromise;
  let router: AnyRouter;

  beforeEach(() => {
    onResolved = new ControlledPromise();

    router = createRouter({
      routeTree: createRootRoute({}),
      history: createMemoryHistory({ initialEntries: ['/about'] }),
    });

    // Force all "onResolve" events to be paused
    const originalRouterSubscribe = router.subscribe;
    router.subscribe = vi.fn((event, fn) => {
      return originalRouterSubscribe(event, async () => {
        if (event === 'onResolved') {
          await onResolved.wait();
        }
        return fn();
      });
    });
  });

  it('displays the progress bar', async () => {
    render(<RouterProgress />, {
      providers: { router: { router } },
    });

    expect(
      await screen.findByRole('progressbar', { name: 'Page loading' }),
    ).not.toBeVisible();

    expect(screen.getByTestId('RouterProgress')).toBeVisible();
  });

  it('starts and completes progress when user navigates', async () => {
    const { providers } = render(<RouterProgress />, {
      providers: { router: { router } },
    });

    await providers.waitForRouter?.();

    expect(nprogress.start).not.toHaveBeenCalled();
    expect(nprogress.complete).not.toHaveBeenCalled();

    await providers.router?.navigate({ to: '/' });

    expect(nprogress.start).toHaveBeenCalledTimes(1);
    expect(nprogress.complete).not.toHaveBeenCalled();

    await act(() => onResolved.continue());

    await waitFor(() => {
      expect(nprogress.complete).toHaveBeenCalledTimes(1);
    });
  });
});
