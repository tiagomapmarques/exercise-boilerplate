import type { PropsWithChildren } from 'react';
import { Trans } from '@lingui/react';
import { Divider, Group, Stack, Text } from '@mantine/core';
import { Link, type LinkProps } from '@tanstack/react-router';
import { Home, Info } from 'lucide-react';

import { ColorSchemePicker } from '@/components/color-scheme-picker';
import { LocalePicker } from '@/components/locale-picker';

import classes from './navigation.module.css';

const NavigationLink = ({
  children,
  ...props
}: PropsWithChildren<LinkProps>) => {
  return (
    <Link
      className={classes.NavigationLink}
      activeProps={{ className: classes.linkActive }}
      {...props}
    >
      <Group gap="sm" align="center">
        {children}
      </Group>
    </Link>
  );
};

export const Navigation = () => {
  return (
    <Stack className={classes.Navigation}>
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

      <Stack gap="lg" justify="end" className={classes.bottom}>
        <LocalePicker />

        <Divider />

        <ColorSchemePicker />
      </Stack>
    </Stack>
  );
};
