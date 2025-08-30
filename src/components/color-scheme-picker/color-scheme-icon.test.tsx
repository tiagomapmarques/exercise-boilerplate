import { render, screen } from '@/testing';

import { ColorSchemeIcon } from './color-scheme-icon';

describe(ColorSchemeIcon, () => {
  it('displays light scheme', () => {
    render(<ColorSchemeIcon colorScheme="light" />);

    expect(screen.getByTestId('ColorSchemeIcon')).toHaveAttribute(
      'data-icon',
      'light',
    );
  });

  it('displays dark scheme', () => {
    render(<ColorSchemeIcon colorScheme="dark" />);

    expect(screen.getByTestId('ColorSchemeIcon')).toHaveAttribute(
      'data-icon',
      'dark',
    );
  });
});
