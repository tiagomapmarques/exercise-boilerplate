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
