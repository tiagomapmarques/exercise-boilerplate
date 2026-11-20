import { render, screen } from '@/testing';

import { HomePage } from './home-page';

describe(HomePage, () => {
  it('displays a title', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  it('displays content', () => {
    render(<HomePage />);

    expect(screen.getByText('Place your UI here')).toBeVisible();
  });
});
