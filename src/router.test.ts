import { Router } from '@tanstack/react-router';

import { NotFoundContainer } from '@/containers/not-found-container';
import { UnexpectedErrorContainer } from '@/containers/unexpected-error-container';

import { router } from './router';

describe('router', () => {
  it('is defined', () => {
    expect(router).toBeInstanceOf(Router);
  });

  it('preloads on intent', () => {
    expect(router.options.defaultPreload).toBe('intent');
  });

  it('renders NotFoundContainer for unknown routes', () => {
    expect(router.options.defaultNotFoundComponent).toBe(NotFoundContainer);
  });

  it('renders UnexpectedErrorContainer for unexpected errors', () => {
    expect(router.options.defaultErrorComponent).toBe(UnexpectedErrorContainer);
  });
});
