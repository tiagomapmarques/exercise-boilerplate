import { useEffect, useState } from 'react';
import { useLingui } from '@lingui/react';
import { AppShell as MantineAppShell, MantineProvider } from '@mantine/core';
import { Outlet, useRouter } from '@tanstack/react-router';

import { LocaleProvider } from '@/providers/locale';
import {
  ProgressBar,
  ProgressBarProvider,
  useProgressBar,
} from '@/providers/progress-bar';
import { BurgerMenu } from '@/components/burger-menu';
import { DevTools } from '@/components/dev-tools';
import { Navigation } from '@/components/navigation';
import { useGlobalThrobber } from '@/services/global';
import { theme } from '@/theme';

const Content = () => {
  const router = useRouter();
  const { i18n } = useLingui();
  const { start, complete } = useProgressBar();

  useEffect(() => {
    router.subscribe('onBeforeNavigate', start);
    router.subscribe('onResolved', complete);
  }, [router, start, complete]);

  return (
    <>
      <ProgressBar label={i18n.t({ id: 'messages.loading' })} />

      <Outlet />

      <DevTools />
    </>
  );
};

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
        <ProgressBarProvider>
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
              <Content />
            </MantineAppShell.Main>
          </MantineAppShell>
        </ProgressBarProvider>
      </LocaleProvider>
    </MantineProvider>
  );
};
