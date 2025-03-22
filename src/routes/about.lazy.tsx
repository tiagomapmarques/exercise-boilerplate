import {
  createLazyFileRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: lazyRouteComponent(
    () => import('../containers'),
    'AboutContainer',
  ),
});
