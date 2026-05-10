import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { Trans, useLingui } from '@lingui/react';
import { Burger, Group, Text } from '@mantine/core';

/** Props for the `BurgerMenu` component. */
export type BurgerMenuProps = PropsWithChildren<{
  /** Whether the menu is open. */
  opened: boolean;
  /** Callback to update the open state - when `undefined`, the burger is not interactive. */
  setOpened: Dispatch<SetStateAction<boolean>> | undefined;
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
    <Group
      h="var(--app-shell-header-height)"
      gap="sm"
      align="center"
      pl={{ base: 'sm', sm: 'md' }}
    >
      <Burger
        size="sm"
        hiddenFrom="sm"
        opened={opened}
        onClick={toggleOpened}
        aria-label={i18n.t({ id: 'titles.menu' })}
      />

      {children ?? (
        <Text>
          <Trans id="titles.app" />
        </Text>
      )}
    </Group>
  );
};
