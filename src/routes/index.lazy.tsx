import { createLazyFileRoute } from '@tanstack/react-router';

import { HomeContainer } from '@/containers/home-container';

export const Route = createLazyFileRoute('/')({
  component: HomeContainer,
});
