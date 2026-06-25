import type { PropsWithChildren } from 'react';
import { createNprogress } from '@mantine/nprogress';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  redirect,
} from '@tanstack/react-router';

import { act, type Mock, render, screen, userEvent } from '@/testing';
import type { ProgressBarActions } from '@/providers/progress-bar';

import { AppShell } from './app-shell';

vi.mock('@mantine/nprogress', async (importActual) => {
  const original = await importActual<typeof import('@mantine/nprogress')>();
  return {
    ...original,
    createNprogress: vi.fn(() => {
      const [store, actions] = original.createNprogress();
      return [
        store,
        {
          ...actions,
          start: vi.fn(actions.start),
          complete: vi.fn(actions.complete),
        },
      ];
    }),
  };
});

describe(AppShell, () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <>
      <div id="document-throbber" />
      {children}
    </>
  );

  it('adds router outlet', async () => {
    const rootRoute = createRootRoute({
      staticData: { getTitle: () => '' },
      component: AppShell,
    });
    rootRoute.addChildren({
      indexRoute: createRoute({
        path: '/',
        staticData: { getTitle: () => '' },
        component: () => <div data-slot="Router-Outlet" />,
        getParentRoute: () => rootRoute,
      }),
    });
    const router = createRouter({ routeTree: rootRoute });

    render(<RouterProvider router={router} />, {
      providers: {
        mantine: false,
        i18n: false,
      },
      wrapper,
    });

    expect(await screen.findByTestId('Router-Outlet')).toBeInTheDocument();
  });

  it('displays header', async () => {
    render(<AppShell />, {
      providers: {
        router: true,
        mantine: false,
        i18n: false,
      },
      wrapper,
    });

    expect(await screen.findByRole('banner')).toHaveTextContent(
      'Exercise boilerplate',
    );
  });

  it('displays router progress', async () => {
    render(<AppShell />, {
      providers: {
        router: true,
        mantine: false,
        i18n: false,
      },
      wrapper,
    });

    expect(
      await screen.findByRole('progressbar', { name: 'Loading page' }),
    ).not.toBeVisible();
  });

  describe('the progress bar', () => {
    const createTestRouter = ({ redirectAboutToIndex = false } = {}) => {
      const rootRoute = createRootRoute({
        staticData: { getTitle: () => '' },
      });
      const indexRoute = createRoute({
        path: '/',
        staticData: { getTitle: () => '' },
        component: () => null,
        getParentRoute: () => rootRoute,
      });
      const aboutRoute = createRoute({
        path: '/about',
        staticData: { getTitle: () => '' },
        beforeLoad: () => {
          if (redirectAboutToIndex) {
            throw redirect({ to: '/' });
          }
        },
        component: () => null,
        getParentRoute: () => rootRoute,
      });

      return createRouter({
        routeTree: rootRoute.addChildren({ indexRoute, aboutRoute }),
        history: createMemoryHistory({ initialEntries: ['/'] }),
      });
    };

    const getNprogressActions = () => {
      const lastCall = (
        createNprogress as Mock<typeof createNprogress>
      ).mock.results.at(-1);

      if (lastCall?.type !== 'return') {
        return {} as Partial<ProgressBarActions>;
      }
      const [, actions] = lastCall.value;

      (actions.start as Mock<ProgressBarActions['start']>).mockClear();
      (actions.complete as Mock<ProgressBarActions['complete']>).mockClear();

      return actions;
    };

    it('does not move when a route is only preloaded', async () => {
      const router = createTestRouter();
      const { providers } = render(<AppShell />, {
        providers: {
          router: { router },
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();
      const { start, complete } = getNprogressActions();

      await act(() => router.preloadRoute({ to: '/about' }));

      expect(start).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });

    it('starts and completes on a real navigation', async () => {
      const router = createTestRouter();
      const { providers } = render(<AppShell />, {
        providers: {
          router: { router },
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();
      const { start, complete } = getNprogressActions();

      await act(() => router.navigate({ to: '/about' }));

      expect(start).toHaveBeenCalledOnce();
      expect(complete).toHaveBeenCalledOnce();
    });

    it('does not move when navigating to the current route', async () => {
      const router = createTestRouter();
      const { providers } = render(<AppShell />, {
        providers: {
          router: { router },
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();
      const { start, complete } = getNprogressActions();

      await act(() => router.navigate({ to: '/' }));

      expect(start).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });

    it('completes when a navigation redirects back to the current route', async () => {
      const router = createTestRouter({ redirectAboutToIndex: true });
      const { providers } = render(<AppShell />, {
        providers: {
          router: { router },
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();
      const { start, complete } = getNprogressActions();

      await act(() => router.navigate({ to: '/about' }));

      expect(start).toHaveBeenCalledOnce();
      expect(complete).toHaveBeenCalledOnce();
    });
  });

  describe('navigation', () => {
    it('displays navigation', async () => {
      const { providers } = render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    it('toggles the menu', async () => {
      const { providers } = render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'data-open',
        'false',
      );

      await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'data-open',
        'true',
      );
    });

    it('closes the menu when user navigates', async () => {
      const { providers } = render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();

      await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'data-open',
        'true',
      );

      await userEvent.click(screen.getByRole('link', { name: 'About' }));

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'data-open',
        'false',
      );
    });
  });
});
