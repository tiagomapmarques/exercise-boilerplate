import { Divider, Flex, Stack, Text } from '@mantine/core';
import { Link, LinkProps, useLocation } from '@tanstack/react-router';
import { Home, Info } from 'lucide-react';
import { PropsWithChildren, useEffect } from 'react';

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
  const [locale] = useLocale();
  const location = useLocation();

  useEffect(() => {
    onInterfaceRerender?.();
  }, [location.pathname, locale]);

  return (
    <Stack style={{ flexGrow: 1 }}>
      <NavigationLink to="/">
        <Home size="20" />

        <Text>Home</Text>
      </NavigationLink>

      <NavigationLink to="/about">
        <Info size="20" />

        <Text>About</Text>
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
