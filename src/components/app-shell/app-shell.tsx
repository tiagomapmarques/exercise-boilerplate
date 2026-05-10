import { useCallback, useEffect, useState } from 'react';
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
import { useDocumentHead, useGlobalThrobber } from '@/services/global';
import { theme } from '@/theme';

const AppContent = () => {
  useDocumentHead();
  const router = useRouter();
  const { i18n } = useLingui();
  const { start, complete } = useProgressBar();

  useEffect(() => {
    const unsubscribeOnBeforeNavigate = router.subscribe(
      'onBeforeNavigate',
      start,
    );
    const unsubscribeOnResolved = router.subscribe('onResolved', complete);

    return () => {
      unsubscribeOnBeforeNavigate();
      unsubscribeOnResolved();
    };
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
  const close = useCallback(() => {
    setOpened(false);
  }, []);

  useEffect(() => {
    const unsubscribeOnBeforeNavigate = router.subscribe(
      'onBeforeNavigate',
      close,
    );

    return () => {
      unsubscribeOnBeforeNavigate();
    };
  }, [router, close]);

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
              <AppContent />
            </MantineAppShell.Main>
          </MantineAppShell>
        </ProgressBarProvider>
      </LocaleProvider>
    </MantineProvider>
  );
};
