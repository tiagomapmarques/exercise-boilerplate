import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { router } from './router';

import '@mantine/core/styles.css';

import { i18n } from '@/i18n';
import { loadMessages } from '@/utilities/locale';

loadMessages(i18n, 'en-GB');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
