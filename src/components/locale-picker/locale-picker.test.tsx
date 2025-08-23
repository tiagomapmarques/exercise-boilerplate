import { render, screen, userEvent } from '@/testing';
import { localeLabels } from '@/components/locale-provider';

import { LocalePicker } from './locale-picker';

describe(LocalePicker, () => {
  it('displays dropdown menu', () => {
    render(<LocalePicker />);

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();
  });

  it('displays selected locale in dropdown menu', () => {
    render(<LocalePicker />, {
      providers: { i18n: { locale: 'de-DE' } },
    });

    expect(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Great Britain English (GB)' }),
    ).not.toBeInTheDocument();
  });

  it('shows all locales in dropdown', async () => {
    render(<LocalePicker />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    );

    expect(screen.getByRole('menu')).toBeVisible();

    for (const { label, country } of Object.values(localeLabels)) {
      expect(
        screen.getByRole('menuitem', { name: `${country} ${label}` }),
      ).toBeVisible();
    }
  });

  it('displays selected locale in dropdown menu', async () => {
    render(<LocalePicker />, {
      providers: { i18n: { locale: 'de-DE' } },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    );

    expect(screen.getByRole('menu')).toBeVisible();

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Great Britain English (GB)' }),
    );

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();
  });
});
