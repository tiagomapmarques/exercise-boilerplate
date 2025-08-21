import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { preloadLocale } from '@/utilities/locale';

// biome-ignore lint/style/noRestrictedImports: Pre-loading translations
import { getAppI18n } from './components/app-shell/i18n';
import { router } from './router';

import './main.css';

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
