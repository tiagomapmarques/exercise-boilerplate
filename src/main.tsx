import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { i18n } from '@/i18n';
import { getInitialLocale, loadMessages } from '@/utilities/locale';

import { router } from './router';

import '@mantine/core/styles.css';

loadMessages(i18n, getInitialLocale());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
