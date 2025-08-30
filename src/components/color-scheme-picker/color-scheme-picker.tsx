import { useLingui } from '@lingui/react';
import {
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';

import { ColorSchemeIcon } from './color-scheme-icon';

export const ColorSchemePicker = () => {
  const { i18n } = useLingui();
  const colorScheme = useComputedColorScheme();
  const { toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  return (
    <Switch
      size="md"
      display="inline-flex"
      aria-label={i18n.t({ id: 'titles.dark-mode' })}
      checked={colorScheme === 'dark'}
      thumbIcon={<ColorSchemeIcon colorScheme={colorScheme} />}
      onChange={toggleColorScheme}
    />
  );
};
