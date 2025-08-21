import { render, screen } from '@/testing';

import { About } from './about';

describe(About, () => {
  it('displays name', () => {
    render(<About />);

    expect(screen.getByText('exercise-boilerplate')).toBeVisible();
  });

  it('displays version', () => {
    render(<About />);

    expect(screen.getByText(/v\d+.\d+.\d+/)).toBeVisible();
  });

  it('displays license', () => {
    render(<About />);

    expect(screen.getByText('License: MIT')).toBeVisible();
  });
});
