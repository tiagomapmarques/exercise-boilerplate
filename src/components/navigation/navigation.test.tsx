import { setupI18n } from '@lingui/core';

import { render, screen, userEvent } from '@/testing';
import { fallbackLocale } from '@/utilities/locale';

import { Navigation } from './navigation';

describe(Navigation, () => {
  test('displays locale picker', () => {
    render(<Navigation />, {
      providers: { router: true },
    });

    expect(screen.getByTestId('LocalePicker')).toBeVisible();
  });

  test('displays color scheme picker', () => {
    render(<Navigation />, {
      providers: {
        router: true,
        mantine: { forceColorScheme: 'light' },
      },
    });

    expect(screen.getByTestId('ColorSchemePicker-Sun')).toBeVisible();
  });

  test('does not change document title without initial messages', () => {
    const i18n = setupI18n({
      locale: fallbackLocale,
      messages: { [fallbackLocale]: {} },
    });

    render(<Navigation />, {
      providers: { router: true, i18n: { i18n } },
    });

    expect(document.title).toBe('Vitest Browser Tester');
  });

  describe('navigation links', () => {
    test('displays links', () => {
      const { providers } = render(<Navigation />, {
        providers: { router: { initialEntries: ['/unknown'] } },
      });

      expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();
      expect(screen.getByRole('link', { name: 'About' })).toBeVisible();

      expect(providers.router?.latestLocation.pathname).toBe('/unknown');
      expect(document.title).toBe('Exercise boilerplate');
    });

    test('displays active route', () => {
      render(<Navigation />, {
        providers: { router: { initialEntries: ['/about'] } },
      });

      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
        'data-status',
      );
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
        'data-status',
        'active',
      );
    });

    test('navigates to home page', async () => {
      const { providers } = render(<Navigation />, {
        providers: { router: { initialEntries: ['/unknown'] } },
      });

      await userEvent.click(screen.getByRole('link', { name: 'Home' }));

      expect(providers.router?.latestLocation.pathname).toBe('/');
      expect(document.title).toBe('Exercise boilerplate - Home');
    });

    test('navigates to home page', async () => {
      const { providers } = render(<Navigation />, {
        providers: { router: { initialEntries: ['/unknown'] } },
      });

      await userEvent.click(screen.getByRole('link', { name: 'Home' }));

      expect(providers.router?.latestLocation.pathname).toBe('/');
      expect(document.title).toBe('Exercise boilerplate - Home');
    });

    test('navigates to about page', async () => {
      const { providers } = render(<Navigation />, {
        providers: { router: { initialEntries: ['/unknown'] } },
      });

      await userEvent.click(screen.getByRole('link', { name: 'About' }));

      expect(providers.router?.latestLocation.pathname).toBe('/about');
      expect(document.title).toBe('Exercise boilerplate - About');
    });
  });
});
