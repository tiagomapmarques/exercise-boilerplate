import '@testing-library/react';

import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-slot',
});

afterEach(() => {
  vi.resetAllMocks();
});
