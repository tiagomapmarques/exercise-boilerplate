import { useEffect, useState } from 'react';
import { Trans, useLingui } from '@lingui/react';
import {
  Burger,
  Flex,
  AppShell as MantineAppShell,
  MantineProvider,
  Text,
} from '@mantine/core';
import { Outlet, useRouter } from '@tanstack/react-router';

import { DevTools } from '@/components/dev-tools';
import { LocaleProvider } from '@/components/locale-provider';
import { Navigation } from '@/components/navigation';
import { RouterProgress } from '@/components/router-progress';
import { theme } from '@/theme';

const globalThrobber = document.getElementById('global-throbber');

type BurgerMenuProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const BurgerMenu = ({ opened, setOpened }: BurgerMenuProps) => {
  const { i18n } = useLingui();

  return (
    <Flex h="3em" gap="sm" align="center" pl={{ base: 'sm', sm: 'md' }}>
      <Burger
        size="sm"
        hiddenFrom="sm"
        opened={opened}
        onClick={() => setOpened((opened) => !opened)}
        aria-label={i18n.t({ id: 'header.menu' })}
      />

      <Text>
        <Trans id="header.logo" />
      </Text>
    </Flex>
  );
};

export const AppShell = () => {
  const router = useRouter();
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    router.subscribe('onBeforeNavigate', () => {
      setMenuOpened(false);
    });

    globalThrobber?.classList.remove('active');
    return () => {
      globalThrobber?.classList.add('active');
    };
  }, [router]);

  return (
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <LocaleProvider>
        <RouterProgress />

        <MantineAppShell
          padding="md"
          header={{ height: '3em' }}
          navbar={{
            width: '16em',
            breakpoint: 'sm',
            collapsed: { mobile: !menuOpened },
          }}
        >
          <MantineAppShell.Header>
            <BurgerMenu opened={menuOpened} setOpened={setMenuOpened} />
          </MantineAppShell.Header>

          <MantineAppShell.Navbar p="md" data-open={menuOpened}>
            <Navigation />
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
