import { render, screen, userEvent } from '@/testing';

import { ColorSchemePicker } from './color-scheme-picker';

describe(ColorSchemePicker, () => {
  it('displays light scheme', () => {
    render(<ColorSchemePicker />, {
      providers: { mantine: { defaultColorScheme: 'light' } },
    });

    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();

    expect(screen.getByTestId('ColorSchemePicker-Sun')).toBeVisible();
    expect(
      screen.queryByTestId('ColorSchemePicker-Moon'),
    ).not.toBeInTheDocument();
  });

  it('displays dark scheme', () => {
    render(<ColorSchemePicker />, {
      providers: { mantine: { defaultColorScheme: 'dark' } },
    });

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();

    expect(screen.getByTestId('ColorSchemePicker-Moon')).toBeVisible();
    expect(
      screen.queryByTestId('ColorSchemePicker-Sun'),
    ).not.toBeInTheDocument();
  });

  it('toggles to color scheme', async () => {
    render(<ColorSchemePicker />, {
      providers: { mantine: { defaultColorScheme: 'dark' } },
    });

    expect(screen.getByTestId('ColorSchemePicker-Moon')).toBeVisible();

    await userEvent.click(screen.getByTestId('ColorSchemePicker-Moon'));

    expect(screen.getByTestId('ColorSchemePicker-Sun')).toBeVisible();
  });
});
