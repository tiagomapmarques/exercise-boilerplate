import type { ComponentProps } from 'react';
import { Moon, Sun } from 'lucide-react';

import classes from './color-scheme-icon.module.css';

const icons = {
  light: Sun,
  dark: Moon,
};

/** Props for the `ColorSchemeIcon` component. */
export type ColorSchemeIconProps = ComponentProps<typeof Sun> & {
  /** Color scheme the icon represents. */
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
