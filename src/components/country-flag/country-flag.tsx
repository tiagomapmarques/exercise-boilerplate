import { Image } from '@mantine/core';

import { type Locale, localeMetadata } from '@/providers/locale';

/** Props for the `CountryFlag` component. */
export type CountryFlagProps = {
  /** Locale whose country flag to display. */
  locale: Locale;
};

export const CountryFlag = ({ locale }: CountryFlagProps) => {
  return (
    <Image
      height="16"
      radius="sm"
      src={`/flags/${localeMetadata[locale].code}.svg`}
      alt={localeMetadata[locale].country}
    />
  );
};
