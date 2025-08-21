import { render, screen } from '@/testing';

import { AboutContainer } from './about-container';

describe(AboutContainer, () => {
  it('displays a title', () => {
    render(<AboutContainer />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeVisible();
  });

  it('displays content', () => {
    render(<AboutContainer />);

    expect(screen.getByText('exercise-boilerplate')).toBeVisible();
  });
});
