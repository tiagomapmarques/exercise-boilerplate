import { Fragment, lazy } from 'react';

export const DevTools = import.meta.env.DEV
  ? lazy(async () => {
      const { TanStackDevtools } = await import('@tanstack/react-devtools');
      const { Environment } = await import('./environment');
      const { TanStackRouterDevtoolsPanel } = await import(
        '@tanstack/react-router-devtools'
      );

      return {
        default: () => (
          <TanStackDevtools
            plugins={[
              { name: 'Environment', render: <Environment /> },
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ),
      };
    })
  : Fragment;
