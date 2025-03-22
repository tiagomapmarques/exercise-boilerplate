import { renderApp, screen } from '@/testing';

import { HomeContainer } from './home-container';

describe(HomeContainer, () => {
  test('displays a title', () => {
    renderApp(<HomeContainer />);

    expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('displays content', () => {
    renderApp(<HomeContainer />);

    expect(screen.getByText('Place your UI here')).toBeVisible();
  });
});
