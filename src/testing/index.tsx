import type { Mock } from 'vitest';
import {
  type ComponentProps,
  Fragment,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { type Messages, setupI18n } from '@lingui/core';
import { I18nProvider, type I18nProviderProps } from '@lingui/react';
import { MantineProvider, type MantineProviderProps } from '@mantine/core';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import {
  render as baseRender,
  renderHook as baseRenderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react';

import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import { messages as messagesFrFr } from '@/locales/fr-FR.po';
import type { Locale } from '@/utilities/locale';

export * from '@testing-library/react';
export * from '@vitest/browser/context';

const createRouterRenderProvider = (
  props:
    | (Partial<Omit<ComponentProps<typeof RouterProvider>, 'children'>> &
        Partial<Parameters<typeof createMemoryHistory>[0]>)
    | boolean
    | undefined,
) => {
  if (!props) {
    return { Provider: Fragment, result: {} };
  }

  const {
    initialEntries = ['/'],
    initialIndex,
    ...providerProps
  } = typeof props === 'object' ? props : {};

  const router = createRouter({
    routeTree: createRootRoute(),
    history: createMemoryHistory({ initialEntries, initialIndex }),
  });

  const Provider = ({ children }: PropsWithChildren) => {
    return (
      <RouterProvider
        router={router}
        {...providerProps}
        defaultComponent={() => children}
      />
    );
  };

  return { Provider, result: { router } };
};

const createMantineRenderProvider = (
  props: Omit<MantineProviderProps, 'children'> | boolean | undefined,
) => {
  if (!props) {
    return { Provider: Fragment, result: {} };
  }

  const parsedProps = {
    ...(typeof props === 'object' ? props : {}),
  };

  const Provider = ({ children }: PropsWithChildren) => (
    <MantineProvider {...parsedProps}>{children}</MantineProvider>
  );

  return { Provider, result: {} };
};

type CustomI18nProps = Partial<Omit<I18nProviderProps, 'children'>> & {
  locale?: Locale;
};

const testingFallbackLocale: Locale = 'en-GB';

const createI18nRenderProvider = (
  props: CustomI18nProps | boolean | undefined,
) => {
  if (!props) {
    return { Provider: Fragment, result: {} };
  }

  const i18nMessages: Record<Locale, Messages> = {
    'en-GB': messagesEnGb,
    'fr-FR': messagesFrFr,
    'de-DE': messagesDeDe,
  };

  const {
    locale = testingFallbackLocale,
    i18n = setupI18n({
      locale,
      messages: { [locale]: i18nMessages[locale] },
    }),
    ...otherProps
  } = typeof props === 'object' ? props : {};

  const parsedProps = {
    i18n,
    ...otherProps,
  };

  const Provider = ({ children }: PropsWithChildren) => {
    return <I18nProvider {...parsedProps}>{children}</I18nProvider>;
  };

  return { Provider, result: { i18n } };
};

type Providers = {
  router?: Parameters<typeof createRouterRenderProvider>[0];
  mantine?: Parameters<typeof createMantineRenderProvider>[0];
  i18n?: Parameters<typeof createI18nRenderProvider>[0];
};

const createWrapper = (
  Wrapper: RenderOptions['wrapper'] = Fragment,
  providers: Providers = {},
) => {
  const RouterRender = createRouterRenderProvider(providers.router);
  const MantineRender = createMantineRenderProvider(providers.mantine);
  const I18nRender = createI18nRenderProvider(providers.i18n);

  return {
    wrapper: ({ children }: PropsWithChildren) => {
      return (
        <RouterRender.Provider>
          <MantineRender.Provider>
            <I18nRender.Provider>
              <Wrapper>{children}</Wrapper>
            </I18nRender.Provider>
          </MantineRender.Provider>
        </RouterRender.Provider>
      );
    },
    result: {
      ...RouterRender.result,
      ...MantineRender.result,
      ...I18nRender.result,
    },
  };
};

/**
 * Renders a component similarly to the `render` function from
 * `@testing-library/react`.
 *
 * It also takes in a `providers` object to auto-wrap the component in the
 * selected app providers. By default, it adds the `i18n` and `mantine`
 * providers.
 */
export const renderApp = (
  ui: ReactNode,
  { providers, ...options }: RenderOptions & { providers?: Providers } = {},
) => {
  const { wrapper, result } = createWrapper(options.wrapper, {
    mantine: true,
    i18n: true,
    ...providers,
  });

  const renderResult = baseRender(ui, { ...options, wrapper });

  return { ...renderResult, providers: result };
};

/**
 * Renders a hook similarly to the `renderHook` function from
 * `@testing-library/react`.
 *
 * It also takes in a `providers` object to auto-wrap the component in the
 * selected app providers. By default, it does not add any app providers.
 */
export const renderAppHook = <HookReturn, HookProps>(
  hook: (initialProps: HookProps) => HookReturn,
  {
    providers,
    ...options
  }: RenderHookOptions<HookProps> & { providers?: Providers } = {},
) => {
  const { wrapper, result } = createWrapper(options.wrapper, {
    ...providers,
  });

  const renderResult = baseRenderHook(hook, { ...options, wrapper });

  return { ...renderResult, providers: result };
};

/** Mocks the `console.error` function. */
export const disableConsoleError = (consoleErrorMock?: Mock) => {
  let original: typeof console.error;

  beforeEach(() => {
    original = console.error;
    Object.defineProperty(console, 'error', {
      value: consoleErrorMock || vi.fn(),
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(console, 'error', {
      value: original,
      configurable: true,
    });
  });
};
