/** biome-ignore-all lint/style/noRestrictedImports: Needed for test setup and as single export point */
import {
  type ComponentProps,
  Fragment,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { setupI18n } from '@lingui/core';
import { I18nProvider, type I18nProviderProps } from '@lingui/react';
import { MantineProvider, type MantineProviderProps } from '@mantine/core';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import {
  act,
  render as baseRender,
  renderHook as baseRenderHook,
  screen as baseScreen,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react';
import { userEvent } from '@vitest/browser/context';

import type { Locale } from '@/components/locale-provider';

import { messages } from './utilities';

export * from '@testing-library/react';
export * from '@vitest/browser/context';

// Wrap `userEvent.click` in an `act` due to inner state changes in the router
const userEventClick = userEvent.click;
userEvent.click = async (...args) => {
  await act(() => userEventClick(...args));
};

// Attach `render` and `renderHook` to screen
export const screen = baseScreen as typeof baseScreen & {
  render: typeof baseRender;
  renderHook: typeof baseRenderHook;
};
screen.render = baseRender;
screen.renderHook = baseRenderHook;

type RouterHistoryProps = Partial<Parameters<typeof createMemoryHistory>[0]>;
type RouterProviderProps = Partial<
  Omit<
    ComponentProps<typeof RouterProvider>,
    'defaultComponent' | 'routeTree' | 'history'
  >
>;

const createRouterRenderProvider = (
  props: RouterHistoryProps | RouterProviderProps | boolean | undefined,
) => {
  if (!props) {
    return { provider: Fragment, result: undefined };
  }

  const {
    initialEntries = ['/'],
    initialIndex,
    router: customRouter,
    ...parsedProps
  }: RouterHistoryProps & RouterProviderProps = typeof props === 'object'
    ? props
    : {};

  const router =
    customRouter ||
    createRouter({
      routeTree: createRootRoute({}),
      history: createMemoryHistory({ initialEntries, initialIndex }),
    });

  /** Function to wait for the router to load and display the correct page. */
  const waitForRouter = async () => {
    await act(() => router.latestLoadPromise);
  };

  function RouterRenderProvider({ children }: PropsWithChildren) {
    return (
      <RouterProvider
        router={router}
        defaultComponent={() => children}
        {...parsedProps}
      />
    );
  }

  return { provider: RouterRenderProvider, result: { router, waitForRouter } };
};

type MantineProps = Omit<MantineProviderProps, 'children'>;

const createMantineRenderProvider = (
  props: MantineProps | boolean | undefined,
) => {
  if (!props) {
    return { provider: Fragment, result: undefined };
  }

  const parsedProps = typeof props === 'object' ? props : {};

  function MantineRenderProvider({ children }: PropsWithChildren) {
    return <MantineProvider {...parsedProps}>{children}</MantineProvider>;
  }

  return { provider: MantineRenderProvider, result: undefined };
};

type I18nProps = Partial<Omit<I18nProviderProps, 'children'>> & {
  locale?: Locale;
};

const createI18nRenderProvider = (props: I18nProps | boolean | undefined) => {
  if (!props) {
    return { provider: Fragment, result: undefined };
  }

  const {
    locale = 'en-GB',
    i18n: customI18n,
    ...parsedProps
  } = typeof props === 'object' ? props : {};

  const i18n = customI18n || setupI18n({ locale, messages });

  function I18nRenderProvider({ children }: PropsWithChildren) {
    return (
      <I18nProvider i18n={i18n} {...parsedProps}>
        {children}
      </I18nProvider>
    );
  }

  return { provider: I18nRenderProvider, result: { i18n } };
};

type Providers = {
  router?: Parameters<typeof createRouterRenderProvider>[0];
  mantine?: Parameters<typeof createMantineRenderProvider>[0];
  i18n?: Parameters<typeof createI18nRenderProvider>[0];
};

type CreateWrapperProps = {
  wrapper?: RenderOptions['wrapper'];
  providers?: Providers;
};

const createWrapper = ({
  wrapper: Wrapper = Fragment,
  providers = {},
}: CreateWrapperProps) => {
  const RouterRender = createRouterRenderProvider(providers.router);
  const MantineRender = createMantineRenderProvider(providers.mantine);
  const I18nRender = createI18nRenderProvider(providers.i18n);

  return {
    wrapper: ({ children }: PropsWithChildren) => (
      <Wrapper>
        <RouterRender.provider>
          <MantineRender.provider>
            <I18nRender.provider>{children}</I18nRender.provider>
          </MantineRender.provider>
        </RouterRender.provider>
      </Wrapper>
    ),
    result: {
      ...(RouterRender.result || {}),
      ...(MantineRender.result || {}),
      ...(I18nRender.result || {}),
    },
  };
};

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

  const { rerender: originalRerender, ...renderResult } = screen.render(ui, {
    ...options,
    wrapper,
  });

  const rerender = (updatedUi = ui) => originalRerender(updatedUi);

  return { ...renderResult, rerender, providers: result };
};

/**
 * Wrapper on the `renderHook` function of `@testing-library/react`. It takes
 * in a `providers` object to auto-wrap the component in the selected app
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

  const renderResult = screen.renderHook(hook, { ...options, wrapper });

  return { ...renderResult, providers: result };
};
