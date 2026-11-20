/** biome-ignore-all lint/suspicious/noConsole: Needed for mocking console calls */

// biome-ignore lint/style/noRestrictedImports: Needed to avoid import loops and mock leaks
import { cleanup, configure } from '@testing-library/react';

import {
  initialDocumentTitle,
  mockConsole,
  resizeViewport,
} from '@/testing/utilities';

import '@/main.css';

const internalGlobal: {
  [key: string]: unknown;
  // biome-ignore lint/style/useNamingConvention: Internal Vitest API - `process.argv` is unavailable in the browser environment
  __vitest_worker__?: { config?: { watch?: unknown } };
} = globalThis;
const internalVitestWatchFlag = internalGlobal.__vitest_worker__?.config?.watch;

if (typeof internalVitestWatchFlag !== 'boolean') {
  throw new Error(
    '`__vitest_worker__.config.watch` is not a boolean - the internal Vitest API changed.',
  );
}
const isWatch = internalVitestWatchFlag === true;

configure({
  testIdAttribute: 'data-slot',
});

const consoleLogMock = mockConsole('log', console.log);
const consoleWarnMock = mockConsole('warn', console.warn);
const consoleErrorMock = mockConsole('error', console.error);

beforeEach(async () => {
  // Reset document title
  document.title = initialDocumentTitle;

  // Reset local storage
  globalThis.localStorage.clear();

  // Reset the viewport
  await resizeViewport('xs');
});

afterEach(({ task, expect }) => {
  // Unmounts before the console check, so errors logged on unmount count too
  cleanup();

  // Console functions check
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
