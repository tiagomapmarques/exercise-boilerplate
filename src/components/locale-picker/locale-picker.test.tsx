import { renderApp, screen, userEvent, waitFor } from '@/testing';
import { localeLabels } from '@/utilities/locale';

import { LocalePicker } from './locale-picker';

describe(LocalePicker, () => {
  test('displays dropdown menu', () => {
    renderApp(<LocalePicker />);

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();
  });

  test('displays selected locale in dropdown menu', () => {
    renderApp(<LocalePicker />, {
      providers: { i18n: { locale: 'de-DE' } },
    });

    expect(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Great Britain English (GB)' }),
    ).not.toBeInTheDocument();
  });

  test('shows all locales in dropdown', async () => {
    renderApp(<LocalePicker />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeVisible();
    });

    for (const { label, country } of Object.values(localeLabels)) {
      expect(
        screen.getByRole('menuitem', { name: `${country} ${label}` }),
      ).toBeVisible();
    }
  });

  test('displays selected locale in dropdown menu', async () => {
    renderApp(<LocalePicker />, {
      providers: { i18n: { locale: 'de-DE' } },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeVisible();
    });

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Great Britain English (GB)' }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Great Britain English (GB)' }),
      ).toBeVisible();
    });
  });
});
