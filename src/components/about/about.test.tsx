import { renderApp, screen } from '@/testing';

import { About } from './about';

describe(About, () => {
  test('displays name', () => {
    renderApp(<About />);

    expect(screen.getByText('exercise-boilerplate')).toBeVisible();
  });

  test('displays version', () => {
    renderApp(<About />);

    expect(screen.getByText(/v\d+.\d+.\d+/)).toBeVisible();
  });

  test('displays license', () => {
    renderApp(<About />);

    expect(screen.getByText('License: MIT')).toBeVisible();
  });
});
