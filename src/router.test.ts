import { Router } from '@tanstack/react-router';

import { router } from './router';

describe('router', () => {
  test('exports a router', () => {
    expect(router).toBeDefined();
    expect(router instanceof Router);
  });
});
