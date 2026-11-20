import { createLazyFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/pages/home-page';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});
