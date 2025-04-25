import { useLingui } from '@lingui/react';
import {
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { Moon, Sun } from 'lucide-react';

export const ColorSchemePicker = () => {
  const { i18n } = useLingui();
  const colorScheme = useComputedColorScheme();
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <Switch
      size="md"
      aria-label={i18n.t({ id: 'boilerplate.navigation.dark-mode' })}
      checked={colorScheme === 'dark'}
      thumbIcon={
        colorScheme === 'dark' ? (
          <Moon
            data-slot="ColorSchemePicker-Moon"
            size="14"
            style={{ color: 'var(--mantine-color-body)' }}
          />
        ) : (
          <Sun
            data-slot="ColorSchemePicker-Sun"
            size="14"
            style={{ color: 'var(--mantine-primary-color-filled)' }}
          />
        )
      }
      onChange={toggleColorScheme}
    />
  );
};
