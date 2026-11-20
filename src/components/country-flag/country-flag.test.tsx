import { render, screen } from '@/testing';
import { localeMetadata, locales } from '@/providers/locale';

import { CountryFlag } from './country-flag';

describe(CountryFlag, () => {
  it.each(locales)('displays the flag for %s', (locale) => {
    render(<CountryFlag locale={locale} />);

    expect(screen.getByRole('img')).toBeVisible();

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}flags/${localeMetadata[locale].code}.svg`,
    );
  });

  describe('the app is served under a base path', () => {
    beforeEach(() => {
      vi.stubEnv('BASE_URL', '/base-path/');
    });

    it('loads the flag from under the base path', () => {
      render(<CountryFlag locale="de-DE" />);

      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        '/base-path/flags/DE.svg',
      );
    });
  });
});
