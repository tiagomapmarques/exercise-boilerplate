/** biome-ignore-all lint/style/noRestrictedImports: Sub-module imports intentional */
import type { ReactNode } from 'react';
import {
  render as baseRender,
  renderHook as baseRenderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react';
import type { UserEventTabOptions } from 'vitest/browser';
import { userEvent as baseUserEvent } from 'vitest/browser';

import { act } from './act';
import {
  type CreateWrapperProps,
  createWrapper,
  type Providers,
} from './render-providers';

export * from '@testing-library/react';
// @ts-expect-error Ignoring as the overriding of the exports is intended
export * from 'vitest';
export type { PrettyDOMOptions } from 'vitest/browser';
export * from 'vitest/browser';

export { act } from './act';

/** `userEvent` from `vitest/browser` with every method wrapped in `act` to flush React state updates before assertions. */
export const userEvent: typeof baseUserEvent = new Proxy(baseUserEvent, {
  get(target, property, receiver) {
    if (property === 'tab') {
      // `tab()` can land focus nowhere in Firefox under Playwright. See
      // https://github.com/microsoft/playwright/issues/32269 for more info.
      return ({ shift = false }: UserEventTabOptions = {}) =>
        // biome-ignore lint/security/noSecrets: False positive
        act(() => target.keyboard(shift ? '{Shift>}{Tab}{/Shift}' : '{Tab}'));
    }
    const value: unknown = Reflect.get(target, property, receiver);
    if (typeof value !== 'function') {
      return value;
    }
    return (...parameters: unknown[]) =>
      act(() => value.call(target, ...parameters));
  },
});

const defaultRenderProviders: Providers = {
  i18n: true,
  mantine: true,
};

/**
 * Wrapper on the `render` function of `@testing-library/react`. It takes in a
 * `providers` object to auto-wrap the component in the selected app providers.
 * By default, it adds the `i18n` and `mantine` providers.
 */
export const render = (
  ui: ReactNode,
  { providers, ...options }: RenderOptions & CreateWrapperProps = {},
) => {
  const { wrapper, result } = createWrapper({
    wrapper: options.wrapper,
    providers: { ...defaultRenderProviders, ...providers },
  });

  const renderResult = baseRender(ui, { ...options, wrapper });

  return { ...renderResult, providers: result };
};

/**
 * Wrapper on the `renderHook` function of `@testing-library/react`. It takes in
 * a `providers` object to auto-wrap the component in the selected app
 * providers. By default, it does not add any app providers.
 */
export const renderHook = <HookReturn, HookProps>(
  hook: (initialProps: HookProps) => HookReturn,
  {
    providers,
    ...options
  }: RenderHookOptions<HookProps> & CreateWrapperProps = {},
) => {
  const { wrapper, result } = createWrapper({
    wrapper: options.wrapper,
    providers,
  });

  const renderResult = baseRenderHook(hook, { ...options, wrapper });

  return { ...renderResult, providers: result };
};

/** Waits `timeout` milliseconds inside `act`, so any state update in that time is flushed. */
export const waitForTimeout = async (timeout: number) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
  });
};
