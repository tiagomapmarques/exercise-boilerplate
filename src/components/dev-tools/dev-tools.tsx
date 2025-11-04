import { Fragment, lazy } from 'react';

export const DevTools =
  // biome-ignore lint/style/noProcessEnv: Removes dev tools from build
  process.env.NODE_ENV !== 'development'
    ? Fragment
    : lazy(async () => {
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
      });
