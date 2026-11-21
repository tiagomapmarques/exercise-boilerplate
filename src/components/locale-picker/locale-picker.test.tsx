import {
  act,
  ControlledPromise,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/testing';
import { localeMetadata, useLocale } from '@/providers/locale';

import { LocalePicker } from './locale-picker';

vi.mock('@/providers/locale/use-locale', async (importActual) => {
  const original =
    await importActual<typeof import('@/providers/locale/use-locale')>();
  return {
    ...original,
    useLocale: vi.fn(original.useLocale),
  };
});

describe(LocalePicker, () => {
  const useLocaleRefs = {
    get setLocale() {
      return vi.mocked(useLocale).mock.results.at(-1)?.value[1];
    },
    get preloadLocale() {
      return vi.mocked(useLocale).mock.results.at(-1)?.value[2];
    },
  };

  beforeEach(async () => {
    const original = await vi.importActual<
      typeof import('@/providers/locale/use-locale')
    >('@/providers/locale/use-locale');

    vi.mocked(useLocale).mockImplementation(() => {
      const [locale, setLocale, preloadLocale] = original.useLocale();
      return [locale, vi.fn(setLocale), vi.fn(preloadLocale)];
    });
  });

  it('displays the default locale on the trigger', () => {
    render(<LocalePicker />, {
      providers: { progressBar: true },
    });

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();
  });

  it('displays a selected locale on the trigger', () => {
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

    expect(screen.getByRole('menu')).toBeVisible();
    expect(screen.getByTestId('ChevronIcon')).toHaveAttribute(
      'data-icon',
      'up',
    );

    for (const { label, country } of Object.values(localeMetadata)) {
      expect(
        screen.getByRole('menuitem', { name: `${country} ${label}` }),
      ).toBeVisible();
    }
  });

  it('updates the trigger to the locale picked', async () => {
    render(<LocalePicker />, {
      providers: {
        i18n: { locale: 'de-DE' },
        progressBar: true,
      },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    );

    expect(screen.getByRole('menu')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Great Britain English (GB)' }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Great Britain English (GB)' }),
    );

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();
  });

  it('starts and completes the progress bar while changing locale', async () => {
    const { providers } = render(<LocalePicker />, {
      providers: {
        i18n: { locale: 'de-DE' },
        progressBar: true,
      },
    });
    const start = providers.progressBar?.actions?.start;
    const complete = providers.progressBar?.actions?.complete;

    await userEvent.click(
      screen.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    );

    expect(screen.getByRole('menu')).toBeVisible();

    expect(start).not.toHaveBeenCalled();
    expect(complete).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Great Britain English (GB)' }),
    );

    expect(start).toHaveBeenCalledExactlyOnceWith();

    await waitFor(() => {
      expect(complete).toHaveBeenCalledExactlyOnceWith();
    });
  });

  it('disables the button while changing locale', async () => {
    const promise = new ControlledPromise();

    render(<LocalePicker />, {
      providers: { progressBar: true },
    });

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeEnabled();

    await userEvent.click(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    );

    expect(screen.getByRole('menu')).toBeVisible();

    useLocaleRefs.setLocale.mockImplementation(() => promise.wait());

    await userEvent.click(
      screen.getByRole('menuitem', { name: 'France Français (FR)' }),
    );

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeDisabled();

    await act(() => promise.resolve());

    expect(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeEnabled();
  });

  it('preloads locale on hover', async () => {
    render(<LocalePicker />, {
      providers: { progressBar: true },
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Great Britain English (GB)' }),
    );

    expect(screen.getByRole('menu')).toBeVisible();

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

    expect(screen.getByRole('menu')).toBeVisible();

    expect(useLocaleRefs.preloadLocale).not.toHaveBeenCalled();

    fireEvent.focus(
      screen.getByRole('menuitem', { name: 'France Français (FR)' }),
    );

    expect(useLocaleRefs.preloadLocale).toHaveBeenCalledExactlyOnceWith(
      'fr-FR',
    );
  });
});
