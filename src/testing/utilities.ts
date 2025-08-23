import type { Mock } from 'vitest';

/**
 * Mocks the `console.log`, `console.warn` or `console.error` function before
 * a test and resets it after.
 */
export const mockConsole = <Type extends 'log' | 'warn' | 'error'>(
  type: Type,
  consoleMock?: Mock<(typeof console)[Type]>,
) => {
  let original: (typeof console)[Type];

  beforeEach(() => {
    original = console[type];

    Object.defineProperty(console, type, {
      value: consoleMock || vi.fn(),
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(console, type, {
      value: original,
      configurable: true,
    });
  });
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
  private resolve: (() => void) | undefined;
  private reject: (() => void) | undefined;

  private get resolved() {
    return !this.resolve && !this.reject;
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
      console.warn(
        'A ControlledPromise tried to `throw` with no previous `wait` call.',
      );
    }

    this.reject?.();
    return this.promise;
  }
}
