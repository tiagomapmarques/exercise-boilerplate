import type { ComponentProps } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const icons = {
  up: ChevronUp,
  down: ChevronDown,
};

/** Props for the `ChevronIcon` component. */
export type ChevronIconProps = ComponentProps<typeof ChevronUp> & {
  /** Chevron icon to display. */
  icon: keyof typeof icons;
};

export const ChevronIcon = ({ icon, ...props }: ChevronIconProps) => {
  const Icon = icons[icon];

  return <Icon data-slot="ChevronIcon" data-icon={icon} size="16" {...props} />;
};
