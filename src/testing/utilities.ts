import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import { messages as messagesEsEs } from '@/locales/es-ES.po';
import { messages as messagesFrFr } from '@/locales/fr-FR.po';
import { messages as messagesItIt } from '@/locales/it-IT.po';

/** All compiled translation messages for every supported locale, keyed by locale code. */
export const messages = {
  'en-GB': messagesEnGb,
  'fr-FR': messagesFrFr,
  'de-DE': messagesDeDe,
  'es-ES': messagesEsEs,
  'it-IT': messagesItIt,
};

/** The default `document.title` set by Vitest's browser runner before the app writes its own. */
export const initialDocumentTitle = document.title;

/**
 * Mocks the getter and setter of a property defined on the prototype chain of
 * `object` before a test and resets it after.
 */
export const mockObjectProperty = <
  T extends object,
  K extends string & keyof T,
>(
  object: T,
  property: K,
) => {
  const resetValue = object[property];

  let prototype = Object.getPrototypeOf(object) as object | null;
  while (prototype) {
    if (Object.getOwnPropertyDescriptor(prototype, property)) {
      break;
    }
    prototype = Object.getPrototypeOf(prototype) as object | null;
  }
  const descriptor = Object.getOwnPropertyDescriptor(prototype, property);

  if (!(descriptor?.set && descriptor.get)) {
    throw new Error(
      `mockObjectProperty: '${property}' must be a read/write accessor on the prototype chain of the given object`,
    );
  }

  const originalGetter = descriptor.get.bind(object) as () => T[K];
  const originalSetter = descriptor.set.bind(object) as (value: T[K]) => void;

  const getter = vi.fn(originalGetter);
  const setter = vi.fn(originalSetter);

  beforeEach(() => {
    getter.mockImplementation(originalGetter);
    setter.mockImplementation(originalSetter);

    Object.defineProperty(object, property, {
      get: getter,
      set: setter,
      configurable: true,
    });
  });

  afterEach(() => {
    delete (object as Record<string, unknown>)[property];
    (object as Record<string, unknown>)[property] = resetValue;
  });

  return { getter, setter };
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

  /** Method to reset the promise to its initial state, discarding any pending resolution. */
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
