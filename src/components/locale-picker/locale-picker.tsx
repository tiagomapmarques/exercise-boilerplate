import { useState } from 'react';
import { Button, Menu, Text } from '@mantine/core';

import { ChevronIcon } from '@/components/chevron-icon';
import { CountryFlag } from '@/components/country-flag';
import { localeLabels, locales, useLocale } from '@/components/locale-provider';

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
          leftSection={<CountryFlag locale={locale} />}
          rightSection={<ChevronIcon icon={open ? 'up' : 'down'} />}
        >
          <Text size="sm">{localeLabels[locale].label}</Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {locales.map((supportedLocale) => (
          <Menu.Item
            key={`LocalePicker-Dropdown-Item-${supportedLocale}`}
            leftSection={<CountryFlag locale={supportedLocale} />}
            onClick={() => setLocale(supportedLocale)}
          >
            {localeLabels[supportedLocale].label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
