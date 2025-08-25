import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { loadLocale } from '@/components/locale-provider/utilities';

import { router } from './router';

import './main.css';

// Start loading the initial translations as soon as possible
loadLocale();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application does not contain root element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
