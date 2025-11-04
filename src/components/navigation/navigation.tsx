import { type PropsWithChildren, useEffect } from 'react';
import type { I18n } from '@lingui/core';
import { Trans, useLingui } from '@lingui/react';
import { Divider, Group, Stack, Text } from '@mantine/core';
import { Link, type LinkProps, useLocation } from '@tanstack/react-router';
import { Home, Info } from 'lucide-react';

import { ColorSchemePicker } from '@/components/color-scheme-picker';
import { LocalePicker } from '@/components/locale-picker';

const updateDocumentTitle = (i18n: I18n, pathname: string | undefined) => {
  if (Object.keys(i18n.messages).length === 0) {
    return;
  }

  let pageTitle = i18n.t({ id: 'titles.app' });

  if (pathname === '/about') {
    pageTitle += ` - ${i18n.t({ id: 'pages.about.title' })}`;
  }
  if (pathname === '/') {
    pageTitle += ` - ${i18n.t({ id: 'pages.home.title' })}`;
  }

  document.title = pageTitle;
};

const NavigationLink = ({
  children,
  ...props
}: PropsWithChildren<LinkProps>) => {
  return (
    <Link
      style={{
        color: 'var(--mantine-color-text)',
        textDecoration: 'none',
      }}
      activeProps={{
        style: {
          color: 'var(--mantine-primary-color-5)',
        },
      }}
      {...props}
    >
      <Group gap="sm" align="center">
        {children}
      </Group>
    </Link>
  );
};

export const Navigation = () => {
  const { i18n } = useLingui();
  const { pathname } = useLocation();

  useEffect(() => {
    updateDocumentTitle(i18n, pathname);
  }, [i18n, i18n.messages, pathname]);

  return (
    <Stack style={{ flexGrow: 1 }}>
      <NavigationLink to="/">
        <Home size="16" />

        <Text>
          <Trans id="pages.home.title" />
        </Text>
      </NavigationLink>

      <NavigationLink to="/about">
        <Info size="16" />

        <Text>
          <Trans id="pages.about.title" />
        </Text>
      </NavigationLink>

      <Stack gap="lg" justify="end" style={{ flexGrow: 1 }}>
        <LocalePicker />

        <Divider />

        <ColorSchemePicker />
      </Stack>
    </Stack>
  );
};
