import type { I18n } from '@lingui/core';
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
  // biome-ignore lint/style/useConsistentTypeDefinitions: Required by TanStack Router for module augmentation
  interface Register {
    router: typeof router;
  }
  // biome-ignore lint/style/useConsistentTypeDefinitions: Required by TanStack Router for module augmentation
  interface StaticDataRouteOption {
    /** Returns the page title for the route, translated using the active `i18n` instance. */
    getTitle: (i18n: I18n) => string;
  }
}
