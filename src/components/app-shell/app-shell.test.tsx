import type { PropsWithChildren } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import { render, screen, userEvent } from '@/testing';

import { AppShell } from './app-shell';

describe(AppShell, () => {
  const outerWrapper = ({ children }: PropsWithChildren) => (
    <>
      {/** biome-ignore lint/correctness/useUniqueElementIds: ID must match index.html */}
      <div id="global-throbber" />
      {children}
    </>
  );

  it('adds router outlet', async () => {
    const rootRoute = createRootRoute({ component: AppShell });
    rootRoute.addChildren({
      indexRoute: createRoute({
        path: '/',
        component: () => <div data-slot="TanstackReactRouter-Outlet" />,
        getParentRoute: () => rootRoute,
      }),
    });
    const router = createRouter({ routeTree: rootRoute });

    render(<RouterProvider router={router} />, {
      providers: {
        mantine: false,
        i18n: false,
      },
      outerWrapper,
    });

    expect(
      await screen.findByTestId('TanstackReactRouter-Outlet'),
    ).not.toBeVisible();
  });

  it('displays header', async () => {
    render(<AppShell />, {
      providers: {
        router: true,
        mantine: false,
        i18n: false,
      },
      outerWrapper,
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
      outerWrapper,
    });

    expect(
      await screen.findByRole('progressbar', { name: 'Loading' }),
    ).not.toBeVisible();
  });

  describe('navigation', () => {
    it('displays navigation', async () => {
      const { providers } = render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
        outerWrapper,
      });

      await providers.waitForRouter?.();

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    it('toggles the menu', async () => {
      const { providers } = render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
        outerWrapper,
      });

      await providers.waitForRouter?.();

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
        outerWrapper,
      });

      await providers.waitForRouter?.();

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
