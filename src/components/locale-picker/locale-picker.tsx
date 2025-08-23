import { useState } from 'react';
import { Button, Image, Menu, Text } from '@mantine/core';
import { ChevronDown } from 'lucide-react';

import {
  type Locale,
  localeLabels,
  useLocale,
} from '@/components/locale-provider';

type LanguageData = {
  label: string;
  country: string;
  flagUrl: string;
};

const localeData = Object.fromEntries(
  Object.entries(localeLabels).map(([locale, { label, country }]) => [
    locale,
    {
      label,
      country,
      flagUrl: `/flags/${locale.split('-')[1].toLowerCase()}.svg`,
    },
  ]),
) as Record<Locale, LanguageData>;

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
          data-expanded={open || undefined}
          leftSection={
            <Image
              height="16"
              radius="sm"
              src={localeData[locale].flagUrl}
              alt={localeData[locale].country}
            />
          }
          rightSection={<ChevronDown size="16" />}
        >
          <Text size="sm">{localeData[locale].label}</Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {(Object.entries(localeData) as [Locale, LanguageData][]).map(
          ([key, { label, country, flagUrl }]) => (
            <Menu.Item
              leftSection={
                <Image height="16" radius="sm" src={flagUrl} alt={country} />
              }
              onClick={() => setLocale(key)}
              key={`LanguagePicker-Dropdown-Item-${key}`}
            >
              {label}
            </Menu.Item>
          ),
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
