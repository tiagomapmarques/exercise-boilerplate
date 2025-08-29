import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import { messages as messagesFrFr } from '@/locales/fr-FR.po';

export const messages = {
  'en-GB': messagesEnGb,
  'fr-FR': messagesFrFr,
  'de-DE': messagesDeDe,
};

/**
 * Mocks the `console.log`, `console.warn` or `console.error` function before
 * a test and resets it after.
 */
export const mockConsole = <Type extends 'log' | 'warn' | 'error'>(
  type: Type,
  callback?: (typeof console)[Type],
) => {
  const callbackMock = vi.fn(callback);
  let original: (typeof console)[Type];

  beforeEach(() => {
    // biome-ignore lint/suspicious/noConsole: Needed for mocking console calls
    original = console[type];

    Object.defineProperty(console, type, {
      value: callbackMock,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(console, type, {
      value: original,
      configurable: true,
    });
  });

  return callbackMock;
};

/**
 * Creates a Promise that you can control when to resolve and/or reject.
 *
 * This is useful when there is the need to stop execution to evaluate the
 * current state of a component or hook. For example on API calls or between
 * component updates.
 */
export class ControlledPromise {
  private promise: Promise<void>;
  // biome-ignore lint/style/useReadonlyClassProperties: False positive
  private resolve: (() => void) | undefined;
  // biome-ignore lint/style/useReadonlyClassProperties: False positive
  private reject: (() => void) | undefined;

  private get resolved() {
    return !(this.resolve || this.reject);
  }

  public constructor() {
    this.promise = Promise.resolve();
    this.resolve = undefined;
    this.reject = undefined;
  }

  /** Method to create and await a promise, or return the promise already being awaited. */
  public wait() {
    if (this.resolved) {
      this.promise = new Promise<void>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      }).then(() => {
        this.resolve = undefined;
        this.reject = undefined;
      });
    }

    return this.promise;
  }

  /** Method to resolve the currently awaited promise. */
  public continue() {
    if (this.resolved) {
      // biome-ignore lint/suspicious/noConsole: Useful to detect potential test errors
      console.warn(
        'A ControlledPromise tried to `continue` with no previous `wait` call.',
      );
    }

    this.resolve?.();
    return this.promise;
  }

  /** Method to reject the currently awaited promise. */
  public throw() {
    if (this.resolved) {
      // biome-ignore lint/suspicious/noConsole: Useful to detect potential test errors
      console.warn(
        'A ControlledPromise tried to `throw` with no previous `wait` call.',
      );
    }

    this.reject?.();
    return this.promise;
  }
}
