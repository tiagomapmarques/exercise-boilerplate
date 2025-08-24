import { Fragment, lazy, useEffect } from 'react';

export const DevTools =
  process.env.NODE_ENV !== 'development'
    ? Fragment
    : lazy(async () => {
        const { TanStackRouterDevtools } = await import(
          '@tanstack/react-router-devtools'
        );

        return {
          default: () => {
            useEffect(() => {
              // biome-ignore lint/suspicious/noConsole: Used only in dev environment
              console.log(
                'Environment:',
                JSON.stringify({ ...import.meta.env }, null, 2),
              );
            });
            return <TanStackRouterDevtools position="bottom-right" />;
          },
        };
      });
