import { Fragment, lazy } from 'react';

// Loaded only by the dev server; test and production builds get nothing.
export const DevTools =
  import.meta.env.MODE === 'development'
    ? lazy(async () => {
        const [
          { TanStackDevtools },
          { Environment },
          { TanStackRouterDevtoolsPanel },
        ] = await Promise.all([
          import('@tanstack/react-devtools'),
          import('./environment'),
          import('@tanstack/react-router-devtools'),
        ]);

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
