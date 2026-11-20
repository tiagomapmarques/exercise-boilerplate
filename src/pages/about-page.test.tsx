import { render, screen } from '@/testing';

import { AboutPage } from './about-page';

describe(AboutPage, () => {
  it('displays a title', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeVisible();
  });

  it('displays content', () => {
    render(<AboutPage />);

    expect(screen.getByText('exercise-boilerplate')).toBeVisible();
  });
});
