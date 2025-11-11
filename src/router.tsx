import { createRouter } from '@tanstack/react-router';

import { NotFoundContainer } from '@/containers/not-found-container';
import { UnexpectedErrorContainer } from '@/containers/unexpected-error-container';

import { routeTree } from './routeTree.gen';

/** Router instance for the app. */
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFoundContainer,
  defaultErrorComponent: UnexpectedErrorContainer,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: Necessary for it to work
  interface Register {
    router: typeof router;
  }
}
