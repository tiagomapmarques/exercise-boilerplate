import { type PropsWithChildren, useEffect } from 'react';
import { Trans, useLingui } from '@lingui/react';
import { Divider, Flex, Stack, Text } from '@mantine/core';
import { Link, type LinkProps, useLocation } from '@tanstack/react-router';
import { Home, Info } from 'lucide-react';

import { ColorSchemePicker } from '@/components/color-scheme-picker';
import { LocalePicker } from '@/components/locale-picker';
import { useLocale } from '@/utilities/locale';

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

export type NavigationProps = {
  onInterfaceRerender?: () => void;
};

export const Navigation = ({ onInterfaceRerender }: NavigationProps) => {
  const { i18n } = useLingui();
  const [locale] = useLocale();
  const location = useLocation();

  if (Object.keys(i18n.messages).length) {
    let pageTitle = i18n.t({ id: 'boilerplate.header.logo' });

    switch (location.pathname) {
      case '/about':
        pageTitle += ` - ${i18n.t({ id: 'boilerplate.about.title' })}`;
        break;
      case '/':
        pageTitle += ` - ${i18n.t({ id: 'boilerplate.home.title' })}`;
        break;
    }

    document.title = pageTitle;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    onInterfaceRerender?.();
  }, [location.pathname, locale]);

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

          <Stack gap="sm">
            <Divider />
            <ColorSchemePicker />
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
};
