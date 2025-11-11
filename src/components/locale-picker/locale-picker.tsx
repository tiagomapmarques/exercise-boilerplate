import { useState } from 'react';
import { Button, Menu, Text } from '@mantine/core';

import {
  type Locale,
  localeLabels,
  locales,
  useLocale,
} from '@/providers/locale';
import { useProgressBar } from '@/providers/progress-bar';
import { ChevronIcon } from '@/components/chevron-icon';
import { CountryFlag } from '@/components/country-flag';

export const LocalePicker = () => {
  const { start, complete } = useProgressBar();
  const [locale, setLocale, preloadLocale] = useLocale();
  const [open, setOpen] = useState(false);

  const handleClick = async (newLocale: Locale) => {
    start();
    await setLocale(newLocale);
    complete();
  };

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
            onMouseOver={() => preloadLocale(supportedLocale)}
            onFocus={() => preloadLocale(supportedLocale)}
            onClick={() => handleClick(supportedLocale)}
          >
            {localeLabels[supportedLocale].label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
