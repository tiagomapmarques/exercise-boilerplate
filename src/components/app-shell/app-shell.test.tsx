import { Mock } from 'vitest';
import { Text } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';

import { renderApp, screen, userEvent } from '@/testing';

import { AppShell } from './app-shell';

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...original,
    Outlet: vi.fn(),
  };
});

describe(AppShell, () => {
  beforeEach(() => {
    (Outlet as unknown as Mock).mockImplementation(() => (
      <Text data-slot="Content" />
    ));
  });

  test('adds i18n provider', () => {
    expect(() =>
      renderApp(<AppShell />, {
        providers: {
          router: true,
          i18n: false,
          mantine: false,
        },
      }),
    ).not.throw();
  });

  test('adds Mantine provider', () => {
    expect(() =>
      renderApp(<AppShell />, {
        providers: {
          router: true,
          i18n: false,
          mantine: false,
        },
      }),
    ).not.throw();
  });

  test('displays header', () => {
    renderApp(<AppShell />, {
      providers: {
        router: true,
        i18n: false,
        mantine: false,
      },
    });

    expect(screen.getByRole('banner')).toHaveTextContent(
      'Exercise boilerplate',
    );
  });

  test('adds router outlet', () => {
    renderApp(<AppShell />, {
      providers: {
        router: true,
        i18n: false,
        mantine: false,
      },
    });

    expect(screen.getByTestId('Content')).toBeVisible();
  });

  describe('navigation', () => {
    test('displays navigation', () => {
      renderApp(<AppShell />, {
        providers: {
          router: true,
          i18n: false,
          mantine: false,
        },
      });

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    test('navigation menu is clickable', async () => {
      renderApp(<AppShell />, {
        providers: {
          router: true,
          i18n: false,
          mantine: false,
        },
      });

      await userEvent.click(screen.getByRole('button', { name: '' }));

      expect(screen.getByRole('button', { name: '' })).toBeVisible();
    });
  });
});
