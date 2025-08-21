import { Router } from '@tanstack/react-router';

import { router } from './router';

describe('router', () => {
  it('exports a router', () => {
    expect(router).toBeDefined();
    expect(router).toBeInstanceOf(Router);
  });
});
