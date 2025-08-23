import { type PropsWithChildren, useEffect } from 'react';
import type { I18n } from '@lingui/core';
import { Trans, useLingui } from '@lingui/react';
import { Divider, Flex, Stack, Text } from '@mantine/core';
import { Link, type LinkProps, useLocation } from '@tanstack/react-router';
import { Home, Info } from 'lucide-react';

import { ColorSchemePicker } from '@/components/color-scheme-picker';
import { LocalePicker } from '@/components/locale-picker';

const updateDocumentTitle = (i18n: I18n, pathname: string) => {
  if (!Object.keys(i18n.messages).length) {
    return;
  }

  let pageTitle = i18n.t({ id: 'boilerplate.header.logo' });

  if (pathname === '/about') {
    pageTitle += ` - ${i18n.t({ id: 'boilerplate.about.title' })}`;
  } else if (pathname === '/') {
    pageTitle += ` - ${i18n.t({ id: 'boilerplate.home.title' })}`;
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
      <Flex gap="sm" align="center">
        {children}
      </Flex>
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
        <Home size="20" />

        <Text>
          <Trans id="boilerplate.home.title" />
        </Text>
      </NavigationLink>

      <NavigationLink to="/about">
        <Info size="20" />

        <Text>
          <Trans id="boilerplate.about.title" />
        </Text>
      </NavigationLink>

      <Flex align="end" style={{ flexGrow: 1 }}>
        <Stack gap="lg" style={{ width: '100%' }}>
          <LocalePicker />

          <Divider />

          <ColorSchemePicker />
        </Stack>
      </Flex>
    </Stack>
  );
};
