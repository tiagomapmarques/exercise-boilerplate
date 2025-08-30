import { render, screen } from '@/testing';

import { ChevronIcon } from './chevron-icon';

describe(ChevronIcon, () => {
  it('displays the `up` icon', () => {
    render(<ChevronIcon icon="up" />);

    expect(screen.getByTestId('ChevronIcon')).toBeVisible();

    expect(screen.getByTestId('ChevronIcon')).toHaveAttribute(
      'data-icon',
      'up',
    );
  });

  it('displays the `down` icon', () => {
    render(<ChevronIcon icon="down" />);

    expect(screen.getByTestId('ChevronIcon')).toBeVisible();

    expect(screen.getByTestId('ChevronIcon')).toHaveAttribute(
      'data-icon',
      'down',
    );
  });
});
