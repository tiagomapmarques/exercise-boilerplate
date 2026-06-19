import { render, screen } from '@/testing';
import { localeMetadata, locales } from '@/providers/locale';

import { CountryFlag } from './country-flag';

describe(CountryFlag, () => {
  it.each(locales)('displays the flag for %s', (locale) => {
    render(<CountryFlag locale={locale} />);

    expect(screen.getByRole('img')).toBeVisible();

    expect(screen.getByRole('img').getAttribute('src')).toMatch(
      new RegExp(`/${localeMetadata[locale].code}\\.svg$`, 'u'),
    );
  });
});
