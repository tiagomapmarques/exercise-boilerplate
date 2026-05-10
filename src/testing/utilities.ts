import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import { messages as messagesEsEs } from '@/locales/es-ES.po';
import { messages as messagesFrFr } from '@/locales/fr-FR.po';
import { messages as messagesItIt } from '@/locales/it-IT.po';

export const messages = {
  'en-GB': messagesEnGb,
  'fr-FR': messagesFrFr,
  'de-DE': messagesDeDe,
  'es-ES': messagesEsEs,
  'it-IT': messagesItIt,
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
  private resolveCallback: (() => void) | undefined;
  private rejectCallback: (() => void) | undefined;

  private get settled() {
    return !(this.resolveCallback ?? this.rejectCallback);
  }

  public constructor() {
    this.promise = Promise.resolve();
    this.resolveCallback = undefined;
    this.rejectCallback = undefined;
  }

  /** Method to create and await a promise, or return the promise already being awaited. */
  public wait() {
    if (this.settled) {
      this.promise = new Promise<void>((resolve, reject) => {
        this.resolveCallback = resolve;
        this.rejectCallback = reject;
      })
        .then(() => {
          this.resolveCallback = undefined;
          this.rejectCallback = undefined;
        })
        .catch((error) => {
          this.resolveCallback = undefined;
          this.rejectCallback = undefined;
          throw error;
        });
    }

    return this.promise;
  }

  /** Method to resolve the currently awaited promise. */
  public resolve() {
    if (this.settled) {
      // biome-ignore lint/suspicious/noConsole: Useful to detect potential test errors
      console.warn(
        'A ControlledPromise tried to `resolve` with no previous `wait` call.',
      );
    }

    this.resolveCallback?.();
    return this.promise;
  }

  /** Method to reject the currently awaited promise. */
  public reject() {
    if (this.settled) {
      // biome-ignore lint/suspicious/noConsole: Useful to detect potential test errors
      console.warn(
        'A ControlledPromise tried to `reject` with no previous `wait` call.',
      );
    }

    this.rejectCallback?.();
    return this.promise;
  }

  public reset() {
    if (!this.settled) {
      // biome-ignore lint/suspicious/noConsole: Useful to detect potential test errors
      console.warn(
        'A ControlledPromise tried to `reset` before being resolved.',
      );
    }

    this.promise = Promise.resolve();
    this.resolveCallback = undefined;
    this.rejectCallback = undefined;
  }
}
