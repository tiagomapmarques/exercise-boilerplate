import {
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { Moon, Sun } from 'lucide-react';

export const ColorSchemePicker = () => {
  const colorScheme = useComputedColorScheme();
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Switch
      size="md"
      checked={colorScheme === 'light'}
      thumbIcon={
        colorScheme === 'light' ? (
          <Sun
            data-slot="ColorSchemePicker-Sun"
            size="14"
            style={{ color: 'var(--mantine-primary-color-filled)' }}
          />
        ) : (
          <Moon
            data-slot="ColorSchemePicker-Moon"
            size="14"
            style={{ color: 'var(--mantine-color-body)' }}
          />
        )
      }
      onChange={({ currentTarget }) =>
        setColorScheme(currentTarget.checked ? 'light' : 'dark')
      }
    />
  );
};
