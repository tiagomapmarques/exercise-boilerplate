import {
  Flex,
  Stack,
  Switch,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { Link, LinkProps, useLocation } from '@tanstack/react-router';
import { Home, Info, Moon, Sun } from 'lucide-react';
import { PropsWithChildren, useEffect } from 'react';

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
  onNavigate?: () => void;
};

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const location = useLocation();
  const colorScheme = useComputedColorScheme();
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    onNavigate?.();
  }, [location.pathname]);

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
        <Switch
          checked={colorScheme === 'light'}
          size="md"
          thumbIcon={
            colorScheme === 'light' ? (
              <Sun
                data-slot="Navigation-Switch-Sun"
                size="14"
                style={{ color: 'var(--mantine-primary-color-filled)' }}
              />
            ) : (
              <Moon
                data-slot="Navigation-Switch-Moon"
                size="14"
                style={{ color: 'var(--mantine-color-body)' }}
              />
            )
          }
          onChange={({ currentTarget }) =>
            setColorScheme(currentTarget.checked ? 'light' : 'dark')
          }
        />
      </Flex>
    </Stack>
  );
};
