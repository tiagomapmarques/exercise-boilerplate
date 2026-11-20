import { Router } from '@tanstack/react-router';

import { NotFoundPage } from '@/pages/not-found-page';
import { UnexpectedErrorPage } from '@/pages/unexpected-error-page';

import { router } from './router';

describe('router', () => {
  it('is defined', () => {
    expect(router).toBeInstanceOf(Router);
  });

  it('serves routes under the base path', () => {
    expect(router.options.basepath).toBe(import.meta.env.BASE_URL);
  });

  it('preloads on intent', () => {
    expect(router.options.defaultPreload).toBe('intent');
  });

  it('displays NotFoundPage for unknown routes', () => {
    expect(router.options.defaultNotFoundComponent).toBe(NotFoundPage);
  });

  it('displays UnexpectedErrorPage for unexpected errors', () => {
    expect(router.options.defaultErrorComponent).toBe(UnexpectedErrorPage);
  });
});
