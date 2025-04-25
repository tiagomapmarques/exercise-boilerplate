import { render, screen } from '@/testing';

import { ExampleContent } from './example-content';

describe(ExampleContent, () => {
  test('displays content', () => {
    render(<ExampleContent />);

    expect(screen.getByText('Place your UI here')).toBeVisible();
  });
});
