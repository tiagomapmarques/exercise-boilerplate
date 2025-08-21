import '@mantine/core/styles.css';

import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-slot',
});

const originalDocumentTitle = document.title;

// Reset environment
beforeEach(() => {
  // Document title
  document.title = originalDocumentTitle;

  // Local storage
  window.localStorage.clear();
});
