import {
  createLazyFileRoute,
  lazyRouteComponent,
} from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: lazyRouteComponent(() => import('@/containers'), 'HomeContainer'),
});
