import { type Mock } from 'vitest';
import { setupI18n } from '@lingui/core';

import { render, screen, userEvent } from '@/testing';
import { fallbackLocale, getAppI18n } from '@/utilities/locale';

import { AppShell } from './app-shell';

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
      render(<AppShell />, {
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
      render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      }),
    ).not.throw();
  });

  test('displays header', () => {
    render(<AppShell />, {
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
    render(<AppShell />, {
      providers: {
        router: true,
        mantine: false,
        i18n: false,
      },
    });

    expect(
      screen.getByLabelText('TanstackReactRouter-Outlet'),
    ).not.toBeVisible();
  });

  test('adds router progress', () => {
    render(<AppShell />, {
      providers: {
        router: true,
        mantine: false,
        i18n: false,
      },
    });

    expect(
      screen.getByRole('progressbar', { name: 'Page loading' }),
    ).not.toBeVisible();
  });

  describe('navigation', () => {
    test('displays navigation', () => {
      render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      });

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    test('menu can be opened', async () => {
      render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      });

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

    test('menu closes when user navigates', async () => {
      render(<AppShell />, {
        providers: {
          router: true,
          mantine: false,
          i18n: false,
        },
      });

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
