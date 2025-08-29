import { useState } from 'react';
import { Button, Image, Menu, Text } from '@mantine/core';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
          rightSection={
            open ? (
              <ChevronUp data-slot="LocalePicker-ChevronUp" size="16" />
            ) : (
              <ChevronDown data-slot="LocalePicker-ChevronDown" size="16" />
            )
          }
        >
          <Text size="sm">{localeLabels[locale].label}</Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {locales.map((supportedLocale) => (
          <Menu.Item
            leftSection={<CountryFlag locale={supportedLocale} />}
            onClick={() => setLocale(supportedLocale)}
            key={`LanguagePicker-Dropdown-Item-${supportedLocale}`}
          >
            {localeLabels[supportedLocale].label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
