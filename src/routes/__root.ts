import { createRootRoute } from '@tanstack/react-router';

import { AppShell } from '@/components/app-shell';

export const Route = createRootRoute({
  staticData: { getTitle: () => '' },
  component: AppShell,
});
