import { render, screen, userEvent } from '@/testing';

import { ColorSchemePicker } from './color-scheme-picker';

describe(ColorSchemePicker, () => {
  it('displays light scheme', () => {
    render(<ColorSchemePicker />, {
      providers: { mantine: { defaultColorScheme: 'light' } },
    });

    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();

    expect(screen.getByTestId('ColorSchemeIcon')).toHaveAttribute(
      'data-icon',
      'light',
    );
  });

  it('displays dark scheme', () => {
    render(<ColorSchemePicker />, {
      providers: { mantine: { defaultColorScheme: 'dark' } },
    });

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();

    expect(screen.getByTestId('ColorSchemeIcon')).toHaveAttribute(
      'data-icon',
      'dark',
    );
  });

  it('toggles to color scheme', async () => {
    render(<ColorSchemePicker />, {
      providers: { mantine: { defaultColorScheme: 'light' } },
    });

    expect(screen.getByTestId('ColorSchemeIcon')).toHaveAttribute(
      'data-icon',
      'light',
    );

    await userEvent.click(screen.getByTestId('ColorSchemeIcon'));

    expect(screen.getByTestId('ColorSchemeIcon')).toHaveAttribute(
      'data-icon',
      'dark',
    );
  });
});
