import type { ComponentProps } from 'react';
import { Moon, Sun } from 'lucide-react';

import classes from './color-scheme-icon.module.css';

const icons = {
  light: Sun,
  dark: Moon,
};

export type ColorSchemeIconProps = ComponentProps<typeof Sun> & {
  colorScheme: keyof typeof icons;
};

export const ColorSchemeIcon = ({
  colorScheme,
  ...props
}: ColorSchemeIconProps) => {
  const Icon = icons[colorScheme];

  return (
    <Icon
      data-slot="ColorSchemeIcon"
      data-icon={colorScheme}
      className={classes.ColorSchemeIcon}
      size="16"
      {...props}
    />
  );
};
