import { Mock } from 'vitest';
import { setupI18n } from '@lingui/core';
import { Text } from '@mantine/core';

import { renderApp, screen, userEvent } from '@/testing';
import { fallbackLocale, getAppI18n } from '@/utilities/locale';

import { AppShell } from './app-shell';

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...original,
    Outlet: vi.fn(() => <Text data-slot="Content" />),
  };
});

vi.mock('@/utilities/locale', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/utilities/locale')>();
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

  test('adds i18n provider', () => {
    expect(() =>
      renderApp(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      }),
    ).not.throw();
  });

  test('adds Mantine provider', () => {
    expect(() =>
      renderApp(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      }),
    ).not.throw();
  });

  test('displays header', () => {
    renderApp(<AppShell />, {
      providers: {
        router: true,
        mantine: false,
        i18n: false,
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
        mantine: false,
        i18n: false,
      },
    });

    expect(screen.getByTestId('Content')).toBeVisible();
  });

  describe('navigation', () => {
    test('displays navigation', () => {
      renderApp(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      });

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    test('navigation menu is clickable', async () => {
      renderApp(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      });

      await userEvent.click(screen.getByRole('button', { name: '' }));

      expect(screen.getByRole('button', { name: '' })).toBeVisible();
    });
  });
});
