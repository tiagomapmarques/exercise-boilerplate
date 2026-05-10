/** biome-ignore-all lint/nursery/noConditionalExpect: Needed to detect unexpected logging in successful tests */
/** biome-ignore-all lint/style/noRestrictedImports: Needed to avoid import loops and mock leaks */
/** biome-ignore-all lint/suspicious/noConsole: Needed for mocking console calls */

import { configure } from '@testing-library/react';

import { mockConsole } from '@/testing/utilities';

import '@/main.css';

const testEnvironment = globalThis as
  // biome-ignore lint/style/useNamingConvention: Internal Vitest API - `process.argv` is unavailable in the browser environment
  { __vitest_worker__?: { config?: { watch?: boolean } } };
const isWatch = Boolean(testEnvironment.__vitest_worker__?.config?.watch);

configure({
  testIdAttribute: 'data-slot',
});

// Reset environment
const originalDocumentTitle = document.title;
beforeEach(() => {
  // Document title
  document.title = originalDocumentTitle;

  // Local storage
  globalThis.localStorage.clear();
});

// Console functions check
const consoleLogMock = mockConsole('log', console.log);
const consoleWarnMock = mockConsole('warn', console.warn);
const consoleErrorMock = mockConsole('error', console.error);
afterEach(({ task, expect }) => {
  if (!isWatch && task.result && !task.result.errors) {
    if (consoleLogMock.mock.calls.length > 0) {
      expect.fail('Unexpected `console.log` calls.');
    }
    if (consoleWarnMock.mock.calls.length > 0) {
      expect.fail('Unexpected `console.warn` calls.');
    }
    if (consoleErrorMock.mock.calls.length > 0) {
      expect.fail('Unexpected `console.error` calls.');
    }
  }
});
