import { useState } from 'react';
import { Button, Group, Image, Menu, Text } from '@mantine/core';
import { ChevronDown } from 'lucide-react';

import { type Locale, localeLabels, useLocale } from '@/utilities/locale';

type LanguageData = {
  label: string;
  country: string;
  flagUrl: string;
};

const languageData = Object.fromEntries(
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
        <Button variant="default" data-expanded={open || undefined}>
          <Group gap="xs">
            <Image
              height="16"
              radius="sm"
              src={languageData[locale].flagUrl}
              alt={languageData[locale].country}
            />

            <Text size="sm">{languageData[locale].label}</Text>

            <ChevronDown size="16" />
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {(Object.entries(languageData) as [Locale, LanguageData][]).map(
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
