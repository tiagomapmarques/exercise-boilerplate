import { renderApp, screen } from '@/testing';

import { AboutContainer } from './about-container';

describe(AboutContainer, () => {
  test('displays a title', () => {
    renderApp(<AboutContainer />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeVisible();
  });

  test('displays content', () => {
    renderApp(<AboutContainer />);

    expect(screen.getByText('exercise-boilerplate')).toBeVisible();
  });
});
