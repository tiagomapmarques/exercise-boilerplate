import { useState } from 'react';
import { Button, Image, Menu, Text } from '@mantine/core';
import { ChevronDown } from 'lucide-react';

import {
  type Locale,
  localeLabels,
  locales,
  useLocale,
} from '@/components/locale-provider';

type CountryFlagProps = {
  locale: Locale;
};

const CountryFlag = ({ locale }: CountryFlagProps) => {
  return (
    <Image
      height="16"
      radius="sm"
      src={`/flags/${localeLabels[locale].code}.svg`}
      alt={localeLabels[locale].country}
    />
  );
};

export const LocalePicker = () => {
  const [locale, setLocale] = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <Menu
      data-slot="LocalePicker"
      radius="md"
      width="target"
      withinPortal
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Menu.Target>
        <Button
          variant="default"
          justify="space-between"
          data-expanded={open || undefined}
          leftSection={<CountryFlag locale={locale} />}
          rightSection={<ChevronDown size="16" />}
        >
          <Text size="sm">{localeLabels[locale].label}</Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {locales.map((locale) => (
          <Menu.Item
            leftSection={<CountryFlag locale={locale} />}
            onClick={() => setLocale(locale)}
            key={`LanguagePicker-Dropdown-Item-${locale}`}
          >
            {localeLabels[locale].label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
