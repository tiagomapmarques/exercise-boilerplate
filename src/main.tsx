import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { getAppI18n, preloadLocale } from '@/utilities/locale';

import { router } from './router';

import '@mantine/core/styles.css';

preloadLocale(getAppI18n());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
