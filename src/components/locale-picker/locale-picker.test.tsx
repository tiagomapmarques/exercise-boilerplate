import { renderApp, screen, userEvent, waitFor } from '@/testing';
import { localeLabels } from '@/utilities/locale';

import { LocalePicker } from './locale-picker';

describe(LocalePicker, () => {
  test('displays dropdown menu', () => {
    renderApp(<LocalePicker />);

    expect(screen.getByRole('button', { name: 'English (GB)' })).toBeVisible();
  });

  test('displays selected locale in dropdown menu', () => {
    renderApp(<LocalePicker />, {
      providers: { i18n: { locale: 'de-DE' } },
    });

    expect(screen.getByRole('button', { name: 'Deutsch (DE)' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'English (GB)' }),
    ).not.toBeInTheDocument();
  });

  test('shows all locales in dropdown', async () => {
    renderApp(<LocalePicker />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'English (GB)' }));

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeVisible();
    });

    for (const name of Object.values(localeLabels)) {
      expect(screen.getByRole('menuitem', { name })).toBeVisible();
    }
  });

  test('displays selected locale in dropdown menu', async () => {
    renderApp(<LocalePicker />, {
      providers: { i18n: { locale: 'de-DE' } },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Deutsch (DE)' }));

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeVisible();
    });

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'English (GB)' }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'English (GB)' }),
      ).toBeVisible();
    });
  });
});
