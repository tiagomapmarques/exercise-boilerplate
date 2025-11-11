import { createNprogress } from '@mantine/nprogress';

import {
  fireEvent,
  type Mock,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/testing';
import { localeLabels, useLocale } from '@/providers/locale';

import { LocalePicker } from './locale-picker';

vi.mock('@/providers/locale/use-locale', async (importActual) => {
  const original =
    await importActual<typeof import('@/providers/locale/use-locale')>();
  return {
    ...original,
    useLocale: vi.fn(() => {
      const result = original.useLocale();
      return [result[0], result[1], vi.fn(result[2])];
    }),
  };
});

const useLocaleRefs = {
  get setLocale() {
    return (useLocale as Mock<typeof useLocale>).mock.results.at(-1)?.value[1];
  },
  get preloadLocale() {
    return (useLocale as Mock<typeof useLocale>).mock.results.at(-1)?.value[2];
  },
};

describe(LocalePicker, () => {
  it('displays dropdown menu', () => {
    render(<LocalePicker />, {
      providers: { progressBar: true },
    });

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();
  });

  it('displays selected locale in dropdown menu', () => {
    render(<LocalePicker />, {
      providers: {
        i18n: { locale: 'de-DE' },
        progressBar: true,
      },
    });

    expect(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Great Britain English (GB)' }),
    ).not.toBeInTheDocument();
  });

  it('displays all locales in dropdown', async () => {
    render(<LocalePicker />, {
      providers: { progressBar: true },
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('ChevronIcon')).toHaveAttribute(
      'data-icon',
      'down',
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    );

    // NOTE: Using `findByRole` due to webkit failing the assertion otherwise.
    expect(await screen.findByRole('menu')).toBeVisible();
    expect(screen.getByTestId('ChevronIcon')).toHaveAttribute(
      'data-icon',
      'up',
    );

    for (const { label, country } of Object.values(localeLabels)) {
      expect(
        screen.getByRole('menuitem', { name: `${country} ${label}` }),
      ).toBeVisible();
    }
  });

  it('changes locale and triggers progress bar', async () => {
    const [store, actions] = createNprogress();
    const start = vi.fn(actions.start);
    const complete = vi.fn(actions.complete);

    render(<LocalePicker />, {
      providers: {
        i18n: { locale: 'de-DE' },
        progressBar: { store, actions: { ...actions, start, complete } },
      },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    );

    // NOTE: Using `findByRole` due to webkit failing the assertion otherwise.
    expect(await screen.findByRole('menu')).toBeVisible();

    expect(start).not.toHaveBeenCalled();
    expect(complete).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Great Britain English (GB)' }),
    );

    expect(start).toHaveBeenCalledTimes(1);

    // NOTE: Using `findByRole` due to webkit failing the assertion otherwise.
    expect(
      await screen.findByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();

    await waitFor(() => {
      expect(complete).toHaveBeenCalledTimes(1);
    });
  });

  it('preloads locale on hover', async () => {
    render(<LocalePicker />, {
      providers: { progressBar: true },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    );

    // NOTE: Using `findByRole` due to webkit failing the assertion otherwise.
    expect(await screen.findByRole('menu')).toBeVisible();

    expect(useLocaleRefs.preloadLocale).not.toHaveBeenCalled();

    await userEvent.hover(
      screen.getByRole('menuitem', { name: 'France Français (FR)' }),
    );

    expect(useLocaleRefs.preloadLocale).toHaveBeenCalledExactlyOnceWith(
      'fr-FR',
    );
  });

  it('preloads locale on focus', async () => {
    render(<LocalePicker />, {
      providers: { progressBar: true },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    );

    // NOTE: Using `findByRole` due to webkit failing the assertion otherwise.
    expect(await screen.findByRole('menu')).toBeVisible();

    expect(useLocaleRefs.preloadLocale).not.toHaveBeenCalled();

    fireEvent.focus(
      screen.getByRole('menuitem', { name: 'France Français (FR)' }),
    );

    expect(useLocaleRefs.preloadLocale).toHaveBeenCalledExactlyOnceWith(
      'fr-FR',
    );
  });
});
