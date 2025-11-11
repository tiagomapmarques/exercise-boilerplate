import { setupI18n } from '@lingui/core';

import { render, screen, userEvent } from '@/testing';
import { fallbackLocale } from '@/providers/locale';

import { Navigation } from './navigation';

describe(Navigation, () => {
  it('displays locale picker', async () => {
    render(<Navigation />, {
      providers: {
        router: true,
        progressBar: true,
      },
    });

    expect(await screen.findByTestId('LocalePicker')).toBeVisible();
  });

  it('displays color scheme picker', async () => {
    render(<Navigation />, {
      providers: {
        router: true,
        mantine: { defaultColorScheme: 'light' },
        progressBar: true,
      },
    });

    expect(await screen.findByTestId('ColorSchemeIcon')).toBeVisible();
  });

  it('does not change document title without initial messages', async () => {
    const i18n = setupI18n({
      locale: fallbackLocale,
      messages: { [fallbackLocale]: {} },
    });

    const { providers } = render(<Navigation />, {
      providers: {
        router: true,
        i18n: { i18n },
        progressBar: true,
      },
    });

    await providers.waitForRouter?.();

    expect(document.title).toBe('Vitest Browser Tester');
  });

  describe('navigation links', () => {
    it('displays links', async () => {
      const { providers } = render(<Navigation />, {
        providers: {
          router: { initialEntries: ['/unknown'] },
          progressBar: true,
        },
      });

      expect(await screen.findByRole('link', { name: 'Home' })).toBeVisible();
      expect(screen.getByRole('link', { name: 'About' })).toBeVisible();

      expect(providers.router?.latestLocation.pathname).toBe('/unknown');
      expect(document.title).toBe('Exercise boilerplate');
    });

    it('displays active route', async () => {
      render(<Navigation />, {
        providers: {
          router: { initialEntries: ['/about'] },
          progressBar: true,
        },
      });

      expect(
        await screen.findByRole('link', { name: 'Home' }),
      ).not.toHaveAttribute('data-status');
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
        'data-status',
        'active',
      );
    });

    it('navigates to home page', async () => {
      const { providers } = render(<Navigation />, {
        providers: {
          router: { initialEntries: ['/unknown'] },
          progressBar: true,
        },
      });

      await userEvent.click(await screen.findByRole('link', { name: 'Home' }));

      expect(providers.router?.latestLocation.pathname).toBe('/');
      expect(document.title).toBe('Exercise boilerplate - Home');
    });

    it('navigates to about page', async () => {
      const { providers } = render(<Navigation />, {
        providers: {
          router: { initialEntries: ['/unknown'] },
          progressBar: true,
        },
      });

      await userEvent.click(await screen.findByRole('link', { name: 'About' }));

      expect(providers.router?.latestLocation.pathname).toBe('/about');
      expect(document.title).toBe('Exercise boilerplate - About');
    });
  });
});
