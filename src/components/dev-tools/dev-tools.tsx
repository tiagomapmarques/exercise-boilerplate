import { Fragment, lazy } from 'react';

export const DevTools =
  process.env.NODE_ENV !== 'development'
    ? Fragment
    : lazy(async () => {
        const { TanStackRouterDevtools } = await import(
          '@tanstack/react-router-devtools'
        );

        return {
          default: () => <TanStackRouterDevtools position="bottom-right" />,
        };
      });
