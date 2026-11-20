import { createLazyFileRoute } from '@tanstack/react-router';

import { AboutPage } from '@/pages/about-page';

export const Route = createLazyFileRoute('/about')({
  component: AboutPage,
});
