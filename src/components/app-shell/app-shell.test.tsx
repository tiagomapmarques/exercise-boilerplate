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

import { act, render, resizeViewport, screen, userEvent } from '@/testing';

import { AppShell } from './app-shell';

vi.mock('@mantine/nprogress', async (importActual) => {
  const original = await importActual<typeof import('@mantine/nprogress')>();
  return {
    ...original,
    createNprogress: vi.fn(original.createNprogress),
  };
});

describe(AppShell, () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <>
      <div id="document-throbber" />
      {children}
    </>
  );

  beforeEach(() => {
    const [store, actions] = createNprogress();
    vi.mocked(createNprogress).mockReturnValue([
      store,
      {
        ...actions,
        start: vi.fn(actions.start),
        complete: vi.fn(actions.complete),
      },
    ]);
  });

  it('adds router outlet', async () => {
    const rootRoute = createRootRoute({
      staticData: { getTitle: () => '' },
      component: AppShell,
    });
    rootRoute.addChildren({
      indexRoute: createRoute({
        path: '/',
        staticData: { getTitle: () => '' },
        component: () => <p>Mock route content</p>,
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

    expect(await screen.findByText('Mock route content')).toBeVisible();
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

    expect(await screen.findByRole('banner')).toMatchTextContent(
      'Exercise boilerplate',
    );
  });

  it('mounts a hidden progress bar', async () => {
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

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes the menu when the user navigates', async () => {
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

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await userEvent.click(screen.getByRole('link', { name: 'About' }));

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('lays the navbar over the page rather than beside it', async () => {
    const { providers } = render(<AppShell />, {
      providers: {
        router: true,
        mantine: false,
        i18n: false,
      },
      wrapper,
    });

    await providers.router?.waitForReady();

    expect(screen.getByRole('navigation').getBoundingClientRect().width).toBe(
      globalThis.innerWidth,
    );
  });

  describe('routing', () => {
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

    const clearProgressBarActions = () => {
      const [, { start, complete }] = createNprogress();

      vi.mocked(start).mockClear();
      vi.mocked(complete).mockClear();

      return { start, complete };
    };

    it('does not move the progress bar when a route is only preloaded', async () => {
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
      const { start, complete } = clearProgressBarActions();

      await act(() => router.preloadRoute({ to: '/about' }));

      expect(start).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });

    it('starts and completes the progress bar on a real navigation', async () => {
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
      const { start, complete } = clearProgressBarActions();

      expect(start).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();

      await act(() => router.navigate({ to: '/about' }));

      expect(start).toHaveBeenCalledOnce();
      expect(complete).toHaveBeenCalledOnce();
    });

    it('does not move the progress bar when navigating to the current route', async () => {
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
      const { start, complete } = clearProgressBarActions();

      await act(() => router.navigate({ to: '/' }));

      expect(start).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });

    it('completes the progress bar when a navigation redirects back to the current route', async () => {
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
      const { start, complete } = clearProgressBarActions();

      expect(start).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();

      await act(() => router.navigate({ to: '/about' }));

      expect(start).toHaveBeenCalledOnce();
      expect(complete).toHaveBeenCalledOnce();
    });
  });

  describe('the viewport is sm or wider', () => {
    beforeEach(async () => {
      await resizeViewport('sm');
    });

    it('sits the navbar beside the page rather than over it', async () => {
      const { providers } = render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
        wrapper,
      });

      await providers.router?.waitForReady();

      expect(
        screen.getByRole('navigation').getBoundingClientRect().width,
      ).toBeLessThan(globalThis.innerWidth);
    });
  });
});
