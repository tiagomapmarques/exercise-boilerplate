/** biome-ignore-all lint/style/noRestrictedImports: Sub-module imports intentional */
import {
  type ComponentProps,
  createContext,
  Fragment,
  type PropsWithChildren,
  type ReactNode,
  use,
  useState,
} from 'react';
import { setupI18n } from '@lingui/core';
import { I18nProvider, type I18nProviderProps } from '@lingui/react';
import {
  createTheme,
  MantineProvider,
  type MantineProviderProps,
  Popover,
} from '@mantine/core';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
  type StaticDataRouteOption,
} from '@tanstack/react-router';
import { act, type RenderOptions } from '@testing-library/react';
import type { MockedObject } from 'vitest';

import type { ProgressBarActions } from '@/providers/progress-bar';
import { fallbackLocale, type Locale } from '@/providers/locale/constants.mts';
import {
  ProgressBarContext,
  type ProgressBarContextValue,
} from '@/providers/progress-bar/context';
import { ProgressBarProvider } from '@/providers/progress-bar/progress-bar-provider';

import { messages } from './utilities';

type RouterHistoryProps = Partial<
  Parameters<typeof createMemoryHistory>[0] & StaticDataRouteOption
>;
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
    getTitle = () => '',
    router: customRouter,
    ...parsedProps
  }: RouterHistoryProps & RouterProviderProps = typeof props === 'object'
    ? props
    : {};

  const router =
    customRouter ||
    createRouter({
      routeTree: createRootRoute({ staticData: { getTitle } }),
      history: createMemoryHistory({ initialEntries, initialIndex }),
      defaultNotFoundComponent: () => <p>Not Found</p>,
    });

  let latestLoadPromise: Promise<void> | undefined;
  let resolveLatestLoad: (() => void) | undefined;

  router.subscribe('onBeforeLoad', () => {
    latestLoadPromise ??= new Promise<void>((resolve) => {
      resolveLatestLoad = resolve;
    });
  });
  router.subscribe('onResolved', () => {
    resolveLatestLoad?.();
    latestLoadPromise = undefined;
    resolveLatestLoad = undefined;
  });

  /** Function to wait for the router to finish loading the current route. */
  const waitForReady = async () => {
    // Stays on the untyped `act`, so the suppression fails as unused once Biome
    // picks the right overload - `./act` can go then.
    // biome-ignore lint/nursery/useAwaitThenable: False positive
    await act(async () => latestLoadPromise);
  };

  // `defaultComponent` must stay referentially stable across renders, or
  // `rerender` silently loses the state of whatever is being tested.
  const ChildrenContext = createContext<ReactNode>(null);
  const RouterChildren = () => use(ChildrenContext);

  const RouterRenderProvider = ({ children }: PropsWithChildren) => {
    return (
      <ChildrenContext.Provider value={children}>
        <RouterProvider
          router={router}
          defaultComponent={RouterChildren}
          {...parsedProps}
        />
      </ChildrenContext.Provider>
    );
  };

  return {
    provider: RouterRenderProvider,
    result: { router: { instance: router, waitForReady } },
  };
};

type MantineProps = Omit<MantineProviderProps, 'children'>;

const createMantineRenderProvider = (
  props: MantineProps | boolean | undefined,
) => {
  if (!props) {
    return { provider: Fragment, result: undefined };
  }

  const { theme, ...parsedProps } = typeof props === 'object' ? props : {};

  // `env="test"` would be simpler but renders portals in place, breaking HTML validity checks
  const testTheme = createTheme({
    ...theme,
    components: {
      // biome-ignore lint/style/useNamingConvention: Mantine keys its component styles by component name
      Popover: Popover.extend({
        defaultProps: {
          // Keeps `referenceHidden` always `false` for a headless browser
          hideDetached: false,
          // Skips the CSS transition for a headless browser
          transitionProps: { duration: 0, exitDuration: 0 },
        },
      }),
      ...theme?.components,
    },
  });

  const MantineRenderProvider = ({ children }: PropsWithChildren) => {
    return (
      <MantineProvider theme={testTheme} {...parsedProps}>
        {children}
      </MantineProvider>
    );
  };

  return { provider: MantineRenderProvider, result: {} };
};

type I18nProps = Partial<Omit<I18nProviderProps, 'children'>> & {
  locale?: Locale;
};

const createI18nRenderProvider = (props: I18nProps | boolean | undefined) => {
  if (!props) {
    return { provider: Fragment, result: undefined };
  }

  const {
    locale = fallbackLocale,
    i18n: customI18n,
    ...parsedProps
  } = typeof props === 'object' ? props : {};

  const i18n = customI18n || setupI18n({ locale, messages });

  const I18nRenderProvider = ({ children }: PropsWithChildren) => {
    return (
      <I18nProvider i18n={i18n} {...parsedProps}>
        {children}
      </I18nProvider>
    );
  };

  return { provider: I18nRenderProvider, result: { i18n } };
};

const createActionSpies = (
  actions: ProgressBarActions,
): MockedObject<ProgressBarActions> => ({
  start: vi.fn(actions.start),
  stop: vi.fn(actions.stop),
  reset: vi.fn(actions.reset),
  set: vi.fn(actions.set),
  increment: vi.fn(actions.increment),
  decrement: vi.fn(actions.decrement),
  complete: vi.fn(actions.complete),
});

type ProgressBarValue = Omit<ProgressBarContextValue, 'actions'> & {
  actions: MockedObject<ProgressBarActions>;
};

const createProgressBarRenderProvider = (props: boolean | undefined) => {
  if (!props) {
    return { provider: Fragment, result: undefined };
  }

  let value: ProgressBarValue | undefined;

  const ProgressBarRenderSpy = ({ children }: PropsWithChildren) => {
    const created = use(ProgressBarContext);
    const [spied] = useState((): ProgressBarValue => {
      if (!created) {
        throw new Error('The `ProgressBarProvider` provided no value.');
      }
      return { ...created, actions: createActionSpies(created.actions) };
    });

    value = spied;

    return (
      <ProgressBarContext.Provider value={spied}>
        {children}
      </ProgressBarContext.Provider>
    );
  };

  const ProgressBarRenderProvider = ({ children }: PropsWithChildren) => {
    return (
      <ProgressBarProvider>
        <ProgressBarRenderSpy>{children}</ProgressBarRenderSpy>
      </ProgressBarProvider>
    );
  };

  return {
    provider: ProgressBarRenderProvider,
    result: {
      progressBar: {
        get store() {
          return value?.store;
        },
        get actions() {
          return value?.actions;
        },
      },
    },
  };
};

/** App providers a test can wrap its subject in, each turned on with `true` or an options object. */
export type Providers = {
  /** Router with an in-memory history, or the router passed in as `router`. */
  router?: Parameters<typeof createRouterRenderProvider>[0];
  /** Mantine provider with a theme suited to a headless browser. */
  mantine?: Parameters<typeof createMantineRenderProvider>[0];
  /** I18n provider with the compiled messages of every supported locale. */
  i18n?: Parameters<typeof createI18nRenderProvider>[0];
  /** Progress bar provider whose actions are spies. */
  progressBar?: Parameters<typeof createProgressBarRenderProvider>[0];
};

/** Options for `createWrapper`. */
export type CreateWrapperProps = {
  /** Component rendered around all the providers. */
  wrapper?: RenderOptions['wrapper'];
  /** Providers to wrap the subject in. */
  providers?: Providers;
};

/** Creates a wrapper component with the selected providers, along with the instances a test can assert against. */
export const createWrapper = ({
  wrapper: Wrapper = Fragment,
  providers = {},
}: CreateWrapperProps) => {
  const RouterRender = createRouterRenderProvider(providers.router);
  const MantineRender = createMantineRenderProvider(providers.mantine);
  const I18nRender = createI18nRenderProvider(providers.i18n);
  const ProgressBarRender = createProgressBarRenderProvider(
    providers.progressBar,
  );

  return {
    wrapper: ({ children }: PropsWithChildren) => (
      <Wrapper>
        <RouterRender.provider>
          <MantineRender.provider>
            <I18nRender.provider>
              <ProgressBarRender.provider>
                {children}
              </ProgressBarRender.provider>
            </I18nRender.provider>
          </MantineRender.provider>
        </RouterRender.provider>
      </Wrapper>
    ),
    result: {
      ...(RouterRender.result ?? {}),
      ...(MantineRender.result ?? {}),
      ...(I18nRender.result ?? {}),
      ...(ProgressBarRender.result ?? {}),
    },
  };
};
