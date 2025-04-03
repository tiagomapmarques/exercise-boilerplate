import { useState } from 'react';
import { Trans } from '@lingui/react';
import {
  Burger,
  Flex,
  AppShell as MantineAppShell,
  MantineProvider,
  Text,
} from '@mantine/core';
import { Outlet } from '@tanstack/react-router';

import { DevTools } from '@/components/dev-tools';
import { Navigation } from '@/components/navigation';
import { theme } from '@/theme';

import { LocaleProvider } from './locale-provider';

export const AppShell = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <LocaleProvider>
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

            <DevTools />
          </MantineAppShell.Main>
        </MantineAppShell>
      </LocaleProvider>
    </MantineProvider>
  );
};
