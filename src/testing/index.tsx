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

  const parsedProps = typeof props === 'boolean' ? {} : props;

  return ({ children }: PropsWithChildren) => (
    <MantineProvider {...parsedProps}>{children}</MantineProvider>
  );
};

type ProviderOptions = {
  providers?: {
    router?: Parameters<typeof createRouterRenderProvider>[0];
    mantine?: Parameters<typeof createMantineRenderProvider>[0];
  };
};

const createWrapper = (
  Wrapper: RenderOptions['wrapper'] = Fragment,
  providers: ProviderOptions['providers'] = {},
) => {
  const RouterRenderProvider = createRouterRenderProvider(providers.router);
  const MantineRenderProvider = createMantineRenderProvider(providers.mantine);

  return ({ children }: PropsWithChildren) => {
    return (
      <RouterRenderProvider>
        <MantineRenderProvider>
          <Wrapper>{children}</Wrapper>
        </MantineRenderProvider>
      </RouterRenderProvider>
    );
  };
};

export const renderApp = (
  ui: ReactNode,
  { providers = {}, ...options }: RenderOptions & ProviderOptions = {},
) => {
  const wrapper = createWrapper(options.wrapper, {
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
    mantine: true,
    ...providers,
  });

  return baseRenderHook(hook, { ...options, wrapper });
};
