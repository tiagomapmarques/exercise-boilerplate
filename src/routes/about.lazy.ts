import { createLazyFileRoute } from '@tanstack/react-router';

import { AboutContainer } from '@/containers/about-container';

export const Route = createLazyFileRoute('/about')({
  component: AboutContainer,
});
