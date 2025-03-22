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

import { Navigation } from '@/components/navigation';
import { headerHeight, theme } from '@/theme';

export const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <MantineAppShell
        header={{ height: headerHeight }}
        navbar={{
          width: '16em',
          breakpoint: 'sm',
          collapsed: { mobile: !menuOpen },
        }}
        padding="md"
      >
        <MantineAppShell.Header>
          <Flex
            h={headerHeight}
            gap="sm"
            align="center"
            pl={{ base: 'sm', sm: 'md' }}
          >
            <Burger
              opened={menuOpen}
              onClick={() => setMenuOpen((currentOpen) => !currentOpen)}
              hiddenFrom="sm"
              size="sm"
            />

            <Text>Exercise boilerplate</Text>
          </Flex>
        </MantineAppShell.Header>

        <MantineAppShell.Navbar p="md">
          <Navigation onNavigate={() => setMenuOpen(false)} />
        </MantineAppShell.Navbar>

        <MantineAppShell.Main>
          <Outlet />

          <TanStackRouterDevtools position="bottom-right" />
        </MantineAppShell.Main>
      </MantineAppShell>
    </MantineProvider>
  );
};
