import type { TanStackDevtoolsReactPlugin } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { Environment } from './environment';

/** Panels the dev tools offer, in the order they are shown. */
export const plugins: TanStackDevtoolsReactPlugin[] = [
  { name: 'Environment', render: <Environment /> },
  { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
];
