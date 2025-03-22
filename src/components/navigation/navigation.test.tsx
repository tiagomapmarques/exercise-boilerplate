import { useMantineColorScheme } from '@mantine/core';
import { Mock } from 'vitest';

import { act, renderApp, screen, userEvent } from '@/testing';

import { Navigation } from './navigation';

vi.mock('@mantine/core', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/core')>();
  return {
    ...original,
    useMantineColorScheme: vi.fn(original.useMantineColorScheme),
  };
});

describe(Navigation, () => {
  describe('navigation links', () => {
    test('displays links', () => {
      renderApp(<Navigation />, {
        providers: { router: true },
      });

      expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();
      expect(screen.getByRole('link', { name: 'About' })).toBeVisible();
    });

    test('navigates to home page', async () => {
      renderApp(<Navigation />, {
        providers: { router: true },
      });

      expect(location.pathname).not.toBe('/');

      await act(async () => {
        await userEvent.click(screen.getByRole('link', { name: 'Home' }));
      });

      expect(location.pathname).toBe('/');
    });

    test('navigates to about page', async () => {
      renderApp(<Navigation />, {
        providers: { router: true },
      });

      expect(location.pathname).not.toBe('/about');

      await act(async () => {
        await userEvent.click(screen.getByRole('link', { name: 'About' }));
      });

      expect(location.pathname).toBe('/about');
    });
  });

  describe('color scheme toggle', () => {
    const setColorScheme = vi.fn();

    beforeEach(() => {
      (useMantineColorScheme as Mock).mockImplementation(() => ({
        setColorScheme,
      }));
    });

    test('displays light scheme', () => {
      renderApp(<Navigation />, {
        providers: {
          router: true,
          mantine: { forceColorScheme: 'light' },
        },
      });

      expect(screen.getByRole('switch')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeChecked();

      expect(screen.getByTestId('Navigation-Switch-Sun')).toBeVisible();
      expect(
        screen.queryByTestId('Navigation-Switch-Moon'),
      ).not.toBeInTheDocument();
    });

    test('displays dark scheme', () => {
      renderApp(<Navigation />, {
        providers: {
          router: true,
          mantine: { forceColorScheme: 'dark' },
        },
      });

      expect(screen.getByRole('switch')).toBeInTheDocument();
      expect(screen.getByRole('switch')).not.toBeChecked();

      expect(screen.getByTestId('Navigation-Switch-Moon')).toBeVisible();
      expect(
        screen.queryByTestId('Navigation-Switch-Sun'),
      ).not.toBeInTheDocument();
    });

    test('toggles to light scheme', async () => {
      renderApp(<Navigation />, {
        providers: {
          router: true,
          mantine: { forceColorScheme: 'dark' },
        },
      });

      expect(setColorScheme).not.toBeCalled();

      await userEvent.click(screen.getByTestId('Navigation-Switch-Moon'));

      expect(setColorScheme).toBeCalledTimes(1);
      expect(setColorScheme).toBeCalledWith('light');
    });

    test('toggles to dark scheme', async () => {
      renderApp(<Navigation />, {
        providers: {
          router: true,
          mantine: { forceColorScheme: 'light' },
        },
      });

      expect(setColorScheme).not.toBeCalled();

      await userEvent.click(screen.getByTestId('Navigation-Switch-Sun'));

      expect(setColorScheme).toBeCalledTimes(1);
      expect(setColorScheme).toBeCalledWith('dark');
    });
  });
});
