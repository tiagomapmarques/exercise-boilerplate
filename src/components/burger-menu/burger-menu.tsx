import type { PropsWithChildren } from 'react';
import { Trans, useLingui } from '@lingui/react';
import { Burger, Group, Text } from '@mantine/core';

export type BurgerMenuProps = PropsWithChildren<{
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}>;

export const BurgerMenu = ({
  opened,
  setOpened,
  children,
}: BurgerMenuProps) => {
  const { i18n } = useLingui();

  const toggleOpened = () => {
    setOpened?.((state) => !state);
  };

  return (
    <Group h="3em" gap="sm" align="center" pl={{ base: 'sm', sm: 'md' }}>
      <Burger
        size="sm"
        hiddenFrom="sm"
        opened={opened}
        onClick={toggleOpened}
        aria-label={i18n.t({ id: 'titles.menu' })}
      />

      {children || (
        <Text>
          <Trans id="titles.app" />
        </Text>
      )}
    </Group>
  );
};
