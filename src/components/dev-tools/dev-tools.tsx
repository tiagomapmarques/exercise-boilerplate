import { Fragment, lazy } from 'react';

// Loaded only by the dev server; test and production builds get nothing
export const DevTools =
  import.meta.env.MODE === 'development'
    ? lazy(async () => {
        const [{ TanStackDevtools }, { plugins }] = await Promise.all([
          import('@tanstack/react-devtools'),
          import('./plugins'),
        ]);

        return { default: () => <TanStackDevtools plugins={plugins} /> };
      })
    : Fragment;
