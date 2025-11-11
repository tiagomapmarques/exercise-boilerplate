import { Image } from '@mantine/core';

import { type Locale, localeLabels } from '@/providers/locale';

export type CountryFlagProps = {
  locale: Locale;
};

export const CountryFlag = ({ locale }: CountryFlagProps) => {
  return (
    <Image
      height="16"
      radius="sm"
      src={`/flags/${localeLabels[locale].code}.svg`}
      alt={localeLabels[locale].country}
    />
  );
};
