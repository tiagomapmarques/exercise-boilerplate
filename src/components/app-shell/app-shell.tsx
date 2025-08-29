import { useEffect, useState } from 'react';
import { AppShell as MantineAppShell, MantineProvider } from '@mantine/core';
import { Outlet, useRouter } from '@tanstack/react-router';

import { BurgerMenu } from '@/components/burger-menu';
import { DevTools } from '@/components/dev-tools';
import { LocaleProvider } from '@/components/locale-provider';
import { Navigation } from '@/components/navigation';
import { RouterProgress } from '@/components/router-progress';
import { useGlobalThrobber } from '@/services/global';
import { theme } from '@/theme';

export const AppShell = () => {
  useGlobalThrobber();

  const router = useRouter();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    router.subscribe('onBeforeNavigate', () => setOpened(false));
  }, [router]);

  return (
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <LocaleProvider>
        <MantineAppShell
          padding="md"
          header={{ height: '3em' }}
          navbar={{
            width: '16em',
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
        >
          <MantineAppShell.Header>
            <BurgerMenu opened={opened} setOpened={setOpened} />
          </MantineAppShell.Header>

          <MantineAppShell.Navbar p="md" data-open={opened}>
            <Navigation />
          </MantineAppShell.Navbar>

          <MantineAppShell.Main>
            <RouterProgress />

            <Outlet />

            <DevTools />
          </MantineAppShell.Main>
        </MantineAppShell>
      </LocaleProvider>
    </MantineProvider>
  );
};
