import { render, screen } from '@/testing';

import { HomeContainer } from './home-container';

describe(HomeContainer, () => {
  it('displays a title', () => {
    render(<HomeContainer />);

    expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  it('displays content', () => {
    render(<HomeContainer />);

    expect(screen.getByText('Place your UI here')).toBeVisible();
  });
});
