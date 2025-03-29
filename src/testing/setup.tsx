import '@testing-library/react';
import '@mantine/core/styles.css';

import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-slot',
});

const originalDocumentTitle = document.title;
afterEach(() => {
  document.title = originalDocumentTitle;
});
