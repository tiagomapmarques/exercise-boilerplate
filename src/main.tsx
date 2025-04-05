import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { getAppI18n, preloadLocale } from '@/utilities/locale';

import { router } from './router';

import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';

preloadLocale(getAppI18n());

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application does not contain root element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
