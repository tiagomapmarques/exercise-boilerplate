import type { Mock } from 'vitest';
import { setupI18n } from '@lingui/core';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import { render, screen, userEvent } from '@/testing';
import { fallbackLocale } from '@/utilities/locale';

import { AppShell } from './app-shell';
// biome-ignore lint/style/noRestrictedImports: Testing only
import { getAppI18n } from './i18n';

vi.mock('./i18n', async (importOriginal) => {
  const original = await importOriginal<typeof import('./i18n')>();
  return {
    ...original,
    getAppI18n: vi.fn(original.getAppI18n),
  };
});

describe(AppShell, () => {
  beforeEach(async () => {
    const { messages } = await import(`../../locales/${fallbackLocale}.po`);
    const i18n = setupI18n({
      locale: fallbackLocale,
      messages: { [fallbackLocale]: messages },
    });
    (getAppI18n as Mock<typeof getAppI18n>).mockImplementation(() => i18n);
  });

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
    });

    expect(
      await screen.findByRole('progressbar', { name: 'Page loading' }),
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
      });

      await providers.router?.waitForLoad();

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    it('toggles the menu', async () => {
      const { providers } = render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      });

      await providers.router?.waitForLoad();

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
      });

      await providers.router?.waitForLoad();

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
