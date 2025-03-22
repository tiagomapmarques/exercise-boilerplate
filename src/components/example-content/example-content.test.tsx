import { renderApp, screen } from '@/testing';

import { ExampleContent } from './example-content';

describe(ExampleContent, () => {
  test('displays content', () => {
    renderApp(<ExampleContent />);

    expect(screen.getByText('Place your UI here')).toBeVisible();
  });
});
