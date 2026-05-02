import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

// biome-ignore lint/style/noRestrictedImports: Purposeful import to have better tree-shaking and keep the function internal
import { loadLocale } from '@/providers/locale/utilities';

import { router } from './router';

import './main.css';

// Start loading the initial translations as soon as possible
// biome-ignore lint/suspicious/noConsole: Useful error at runtime
loadLocale().catch(console.error);

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('Application does not contain root element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
