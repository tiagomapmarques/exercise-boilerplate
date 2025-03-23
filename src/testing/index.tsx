import { setupI18n } from '@lingui/core';
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
import { ComponentProps, Fragment, PropsWithChildren, ReactNode } from 'react';
import { Mock } from 'vitest';

import { messages as messagesDeDe } from '@/locales/de-DE.po';
import { messages as messagesEnGb } from '@/locales/en-GB.po';
import type { Locale } from '@/utilities/locale';

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

type CustomI18nProps = Partial<Omit<I18nProviderProps, 'children'>> & {
  locale?: Locale;
};

const createI18nRenderProvider = (
  props: CustomI18nProps | boolean | undefined,
) => {
  if (!props) {
    return Fragment;
  }

  const i18nMessages = {
    'en-GB': messagesEnGb,
    'de-DE': messagesDeDe,
  };

  const { locale = 'en-GB', ...otherProps } =
    typeof props === 'object' ? props : {};

  const parsedProps = {
    i18n: setupI18n(),
    ...otherProps,
  };

  return ({ children }: PropsWithChildren) => {
    parsedProps.i18n.loadAndActivate({
      locale,
      messages: i18nMessages[locale],
    });
    return <I18nProvider {...parsedProps}>{children}</I18nProvider>;
  };
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

type ProviderOptions = {
  providers?: {
    router?: Parameters<typeof createRouterRenderProvider>[0];
    i18n?: Parameters<typeof createI18nRenderProvider>[0];
    mantine?: Parameters<typeof createMantineRenderProvider>[0];
  };
};

const createWrapper = (
  Wrapper: RenderOptions['wrapper'] = Fragment,
  providers: ProviderOptions['providers'] = {},
) => {
  const RouterRenderProvider = createRouterRenderProvider(providers.router);
  const I18nRenderProvider = createI18nRenderProvider(providers.i18n);
  const MantineRenderProvider = createMantineRenderProvider(providers.mantine);

  return ({ children }: PropsWithChildren) => {
    return (
      <RouterRenderProvider>
        <I18nRenderProvider>
          <MantineRenderProvider>
            <Wrapper>{children}</Wrapper>
          </MantineRenderProvider>
        </I18nRenderProvider>
      </RouterRenderProvider>
    );
  };
};

export const renderApp = (
  ui: ReactNode,
  { providers = {}, ...options }: RenderOptions & ProviderOptions = {},
) => {
  const wrapper = createWrapper(options.wrapper, {
    i18n: true,
    mantine: true,
    ...providers,
  });

  return baseRender(ui, { ...options, wrapper });
};

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

export const disableConsoleError = (fn?: Mock) => {
  let original = console.error;

  beforeEach(() => {
    original = console.error;
    Object.defineProperty(console, 'error', {
      value: fn || vi.fn(),
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
