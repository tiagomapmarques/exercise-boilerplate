import { Mock } from 'vitest';
import { ComponentProps, Fragment, PropsWithChildren, ReactNode } from 'react';
import { Messages, setupI18n } from '@lingui/core';
import { I18nProvider, I18nProviderProps } from '@lingui/react';
import { MantineProvider, MantineProviderProps } from '@mantine/core';
import {
  RouterProvider,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';
import {
  RenderHookOptions,
  RenderOptions,
  act,
  render as baseRender,
  renderHook as baseRenderHook,
} from '@testing-library/react';
import { userEvent } from '@vitest/browser/context';

import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import { fallbackLocale, type Locale } from '@/utilities/locale';

export * from '@testing-library/react';

const userEventClick = userEvent.click;
userEvent.click = async function (...args) {
  // This `act` wrapper is needed due to some inner state changes in the router
  await act(async () => {
    await userEventClick(...args);
  });
};

export { userEvent };

const createRouterRenderProvider = (
  props:
    | Omit<ComponentProps<typeof RouterProvider>, 'children'>
    | boolean
    | undefined,
) => {
  if (!props) {
    return Fragment;
  }

  const testRouter = createRouter({
    routeTree: createRootRoute(),
  });
  const parsedProps = {
    router: testRouter,
    ...(typeof props === 'object' ? props : {}),
  };

  return ({ children }: PropsWithChildren) => (
    <RouterProvider {...parsedProps} defaultComponent={() => children} />
  );
};

const createMantineRenderProvider = (
  props: Omit<MantineProviderProps, 'children'> | boolean | undefined,
) => {
  if (!props) {
    return Fragment;
  }

  const parsedProps = {
    ...(typeof props === 'object' ? props : {}),
  };

  return ({ children }: PropsWithChildren) => (
    <MantineProvider {...parsedProps}>{children}</MantineProvider>
  );
};

type CustomI18nProps = Partial<Omit<I18nProviderProps, 'children'>> & {
  locale?: Locale;
};

const createI18nRenderProvider = (
  props: CustomI18nProps | boolean | undefined,
) => {
  if (!props) {
    return Fragment;
  }

  const i18nMessages: Record<Locale, Messages> = {
    'en-GB': messagesEnGb,
    'de-DE': messagesDeDe,
  };

  const {
    locale = fallbackLocale,
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

  return ({ children }: PropsWithChildren) => {
    return <I18nProvider {...parsedProps}>{children}</I18nProvider>;
  };
};

type ProviderOptions = {
  providers?: {
    router?: Parameters<typeof createRouterRenderProvider>[0];
    mantine?: Parameters<typeof createMantineRenderProvider>[0];
    i18n?: Parameters<typeof createI18nRenderProvider>[0];
  };
};

const createWrapper = (
  Wrapper: RenderOptions['wrapper'] = Fragment,
  providers: ProviderOptions['providers'] = {},
) => {
  const RouterRenderProvider = createRouterRenderProvider(providers.router);
  const MantineRenderProvider = createMantineRenderProvider(providers.mantine);
  const I18nRenderProvider = createI18nRenderProvider(providers.i18n);

  return ({ children }: PropsWithChildren) => {
    return (
      <RouterRenderProvider>
        <MantineRenderProvider>
          <I18nRenderProvider>
            <Wrapper>{children}</Wrapper>
          </I18nRenderProvider>
        </MantineRenderProvider>
      </RouterRenderProvider>
    );
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
  { providers = {}, ...options }: RenderOptions & ProviderOptions = {},
) => {
  const wrapper = createWrapper(options.wrapper, {
    mantine: true,
    i18n: true,
    ...providers,
  });

  return baseRender(ui, { ...options, wrapper });
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
    providers = {},
    ...options
  }: RenderHookOptions<HookProps> & ProviderOptions = {},
) => {
  const wrapper = createWrapper(options.wrapper, {
    ...providers,
  });

  return baseRenderHook(hook, { ...options, wrapper });
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
