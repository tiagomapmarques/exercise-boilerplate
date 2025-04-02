import { type Mock } from 'vitest';
import { useMantineColorScheme } from '@mantine/core';

import { renderApp, screen, userEvent } from '@/testing';

import { ColorSchemePicker } from './color-scheme-picker';

describe(ColorSchemePicker, () => {
  const setColorScheme = vi.fn();

  beforeEach(async () => {
    const useOriginal = (
      await vi.importActual<typeof import('@mantine/core')>('@mantine/core')
    ).useMantineColorScheme;

    (
      useMantineColorScheme as Mock<typeof useMantineColorScheme>
    ).mockImplementation((props) => ({
      ...useOriginal(props),
      setColorScheme,
    }));
  });

  test('displays light scheme', () => {
    renderApp(<ColorSchemePicker />, {
      providers: { mantine: { forceColorScheme: 'light' } },
    });

    expect(screen.getByRole('switch')).toBeChecked();

    expect(screen.getByTestId('ColorSchemePicker-Sun')).toBeVisible();
    expect(
      screen.queryByTestId('ColorSchemePicker-Moon'),
    ).not.toBeInTheDocument();
  });

  test('displays dark scheme', () => {
    renderApp(<ColorSchemePicker />, {
      providers: { mantine: { forceColorScheme: 'dark' } },
    });

    expect(screen.getByRole('switch')).not.toBeChecked();

    expect(screen.getByTestId('ColorSchemePicker-Moon')).toBeVisible();
    expect(
      screen.queryByTestId('ColorSchemePicker-Sun'),
    ).not.toBeInTheDocument();
  });

  test('toggles to light scheme', async () => {
    renderApp(<ColorSchemePicker />, {
      providers: { mantine: { forceColorScheme: 'dark' } },
    });

    expect(setColorScheme).not.toBeCalled();

    await userEvent.click(screen.getByTestId('ColorSchemePicker-Moon'));

    expect(setColorScheme).toBeCalledTimes(1);
    expect(setColorScheme).toBeCalledWith('light');
  });

  test('toggles to dark scheme', async () => {
    renderApp(<ColorSchemePicker />, {
      providers: { mantine: { forceColorScheme: 'light' } },
    });

    expect(setColorScheme).not.toBeCalled();

    await userEvent.click(screen.getByTestId('ColorSchemePicker-Sun'));

    expect(setColorScheme).toBeCalledTimes(1);
    expect(setColorScheme).toBeCalledWith('dark');
  });
});
