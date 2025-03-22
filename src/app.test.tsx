import { render, screen } from '@/testing';

import { App } from './app';

describe(App, async () => {
  it('displays app message', () => {
    render(<App />);

    expect(screen.getByText('Hello world')).toBeVisible();
  });
});
