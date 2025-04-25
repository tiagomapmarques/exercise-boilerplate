import { render, screen } from '@/testing';

import { About } from './about';

describe(About, () => {
  test('displays name', () => {
    render(<About />);

    expect(screen.getByText('exercise-boilerplate')).toBeVisible();
  });

  test('displays version', () => {
    render(<About />);

    expect(screen.getByText(/v\d+.\d+.\d+/)).toBeVisible();
  });

  test('displays license', () => {
    render(<About />);

    expect(screen.getByText('License: MIT')).toBeVisible();
  });
});
