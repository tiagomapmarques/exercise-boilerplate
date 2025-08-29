import { Fragment, lazy, useEffect } from 'react';

export const DevTools =
  process.env.NODE_ENV !== 'development'
    ? Fragment
    : lazy(async () => {
        const { TanStackDevtools } = await import('@tanstack/react-devtools');
        const { TanStackRouterDevtoolsPanel } = await import(
          '@tanstack/react-router-devtools'
        );

        return {
          default: () => {
            useEffect(() => {
              // biome-ignore lint/suspicious/noConsole: DEV environment only
              console.log(
                'Environment:',
                JSON.stringify({ ...import.meta.env }, null, 2),
              );
            }, []);

            return (
              <TanStackDevtools
                plugins={[
                  {
                    name: 'TanStack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                ]}
              />
            );
          },
        };
      });
