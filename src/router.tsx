import type { I18n, MessageDescriptor } from '@lingui/core';
import { createRouter } from '@tanstack/react-router';

import { NotFoundPage } from '@/pages/not-found-page';
import { UnexpectedErrorPage } from '@/pages/unexpected-error-page';

import { routeTree } from './routeTree.gen';

/** Router instance for the app. */
export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: UnexpectedErrorPage,
});

declare module '@tanstack/react-router' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: Required by TanStack Router for module augmentation
  interface Register {
    router: typeof router;
  }
  // biome-ignore lint/style/useConsistentTypeDefinitions: Required by TanStack Router for module augmentation
  interface StaticDataRouteOption {
    /** Returns the page title for the route, translated using the active `i18n` instance and optional message values. */
    getTitle: (i18n: I18n, values?: MessageDescriptor['values']) => string;
  }
}
