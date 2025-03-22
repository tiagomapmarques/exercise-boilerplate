import { createRouter } from '@tanstack/react-router';

import { NotFoundContainer } from '@/containers';

import { routeTree } from './routeTree.gen';

// Create a new router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFoundContainer,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
