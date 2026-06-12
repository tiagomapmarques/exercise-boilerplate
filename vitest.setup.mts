/** biome-ignore-all lint/suspicious/noConsole: Needed for mocking console calls */

// biome-ignore lint/style/noRestrictedImports: Needed to avoid import loops and mock leaks
import { configure } from '@testing-library/react';

import { initialDocumentTitle, mockConsole } from '@/testing/utilities';

import '@/main.css';

const internalVitestWatchFlag =
  // biome-ignore lint/style/useNamingConvention: Internal Vitest API - `process.argv` is unavailable in the browser environment
  (globalThis as { __vitest_worker__?: { config?: { watch?: unknown } } })
    .__vitest_worker__?.config?.watch;

if (typeof internalVitestWatchFlag !== 'boolean') {
  console.warn(
    '`__vitest_worker__.config.watch` is not a boolean - the internal Vitest API may have changed.',
  );
}
const isWatch = internalVitestWatchFlag === true;

configure({
  testIdAttribute: 'data-slot',
});

// Reset environment
beforeEach(() => {
  // Document title
  document.title = initialDocumentTitle;

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
