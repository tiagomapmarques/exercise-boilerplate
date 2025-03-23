import { Trans } from '@lingui/react';
import { I18nProvider as LinguiProvider } from '@lingui/react';
import {
  Burger,
  Flex,
  AppShell as MantineAppShell,
  MantineProvider,
  Text,
} from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useState } from 'react';
import { PropsWithChildren } from 'react';

import { Navigation } from '@/components/navigation';
import { i18n } from '@/i18n';
import { theme } from '@/theme';

const I18nProvider = ({ children }: PropsWithChildren) => {
  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
};

export const AppShell = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <I18nProvider>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <MantineAppShell
          header={{ height: '3em' }}
          navbar={{
            width: '16em',
            breakpoint: 'sm',
            collapsed: { mobile: !menuOpened },
          }}
          padding="md"
        >
          <MantineAppShell.Header>
            <Flex h="3em" gap="sm" align="center" pl={{ base: 'sm', sm: 'md' }}>
              <Burger
                opened={menuOpened}
                onClick={() => setMenuOpened((opened) => !opened)}
                hiddenFrom="sm"
                size="sm"
              />

              <Text>
                <Trans id="boilerplate.header.logo" />
              </Text>
            </Flex>
          </MantineAppShell.Header>

          <MantineAppShell.Navbar p="md">
            <Navigation onInterfaceRerender={() => setMenuOpened(false)} />
          </MantineAppShell.Navbar>

          <MantineAppShell.Main>
            <Outlet />

            <TanStackRouterDevtools position="bottom-right" />
          </MantineAppShell.Main>
        </MantineAppShell>
      </MantineProvider>
    </I18nProvider>
  );
};
