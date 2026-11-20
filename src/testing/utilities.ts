/** biome-ignore-all lint/style/noRestrictedImports: Sub-module imports intentional */
import type { Messages } from '@lingui/core';
import { DEFAULT_THEME, type MantineBreakpoint } from '@mantine/core';
import { waitFor } from '@testing-library/react';
import { page } from 'vitest/browser';

import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import { messages as messagesEsEs } from '@/locales/es-ES.po';
import { messages as messagesFrFr } from '@/locales/fr-FR.po';
import { messages as messagesItIt } from '@/locales/it-IT.po';
import type { Locale } from '@/providers/locale/constants.mts';

import { act } from './act';

const pixelsPerEm = 16;
const viewportHeight = 800;

/** Size of the browser viewport a test runs at. */
export type ViewportDimensions = {
  /** Width of the viewport in pixels. */
  width: number;
  /** Height of the viewport in pixels. */
  height: number;
};

/** Viewport to resize to, either a Mantine breakpoint or an explicit size. */
export type ViewportSize = MantineBreakpoint | ViewportDimensions;

const toViewportDimensions = (size: ViewportSize): ViewportDimensions => {
  if (typeof size !== 'string') {
    return size;
  }

  return {
    width: Number.parseFloat(DEFAULT_THEME.breakpoints[size]) * pixelsPerEm,
    height: viewportHeight,
  };
};

/** Resizes the viewport and waits until the app has settled into it. */
export const resizeViewport = async (size: ViewportSize) => {
  const { width, height } = toViewportDimensions(size);

  if (globalThis.innerWidth === width && globalThis.innerHeight === height) {
    return;
  }

  await act(async () => {
    await page.viewport(width, height);

    // Media query listeners are notified after the viewport itself changes
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => setTimeout(resolve, 0));
    });
  });

  await waitFor(() => {
    expect(globalThis.innerWidth).toBe(width);
    // Mantine clears this flag from a timer 200ms after a resize, which would
    // otherwise update state once the test is over.
    expect(document.querySelector('[data-resizing]')).toBeNull();
  });
};

/** All compiled translation messages for every supported locale, keyed by locale code. */
export const messages = {
  'en-GB': messagesEnGb,
  'fr-FR': messagesFrFr,
  'de-DE': messagesDeDe,
  'es-ES': messagesEsEs,
  'it-IT': messagesItIt,
} satisfies Record<Locale, Messages>;

/** The default `document.title` set by Vitest's browser runner before the app writes its own. */
export const initialDocumentTitle = document.title;

/**
 * Mocks the getter and setter of a property defined on the prototype chain of
 * `object` before a test and resets it after.
 */
export const mockObjectProperty = <
  Owner extends object,
  Property extends string & keyof Owner,
>(
  object: Owner,
  property: Property,
) => {
  const resetValue = object[property];

  let prototype: object | null = Object.getPrototypeOf(object);
  while (prototype) {
    if (Object.getOwnPropertyDescriptor(prototype, property)) {
      break;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  const descriptor = Object.getOwnPropertyDescriptor(prototype, property);

  if (!(descriptor?.set && descriptor.get)) {
    throw new Error(
      `mockObjectProperty: '${property}' must be a read/write accessor on the prototype chain of the given object`,
    );
  }

  const originalGetter: () => Owner[Property] = descriptor.get.bind(object);
  const originalSetter: (value: Owner[Property]) => void =
    descriptor.set.bind(object);

  const getter = vi.fn(originalGetter);
  const setter = vi.fn(originalSetter);

  beforeEach(() => {
    Object.defineProperty(object, property, {
      get: getter,
      set: setter,
      configurable: true,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(object, property);
    originalSetter(resetValue);
  });

  return { getter, setter };
};

/**
 * Mocks the `console.log`, `console.warn` or `console.error` function before a
 * test and resets it after.
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

/** Promise a test resolves or rejects by hand, to assert on the state in between. */
export class ControlledPromise {
  /** The current promise, replaced each time `reset` creates a new one. */
  private promise!: Promise<void>;

  /** Resolves the current promise, replaced each time `reset` creates a new one. */
  private resolveCallback!: () => void;

  /** Rejects the current promise, replaced each time `reset` creates a new one. */
  private rejectCallback!: (reason?: unknown) => void;

  public constructor() {
    this.reset();
  }

  /** Returns the current promise, which settles once the test resolves or rejects it. */
  public wait() {
    return this.promise;
  }

  /** Resolves the promise, whether or not it is awaited yet. */
  public resolve() {
    this.resolveCallback();
    return this.promise;
  }

  /** Rejects the promise, whether or not it is awaited yet, resolving with its settled result instead of throwing the reason. */
  public async reject(
    reason: unknown = new Error('Caller gave no reason.'),
  ): Promise<PromiseSettledResult<void>> {
    this.rejectCallback(reason);
    const [settled] = await Promise.allSettled([this.promise]);
    return settled;
  }

  /** Creates a fresh promise, discarding any pending resolution. */
  public reset() {
    this.promise = new Promise<void>((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;
    });
  }
}
