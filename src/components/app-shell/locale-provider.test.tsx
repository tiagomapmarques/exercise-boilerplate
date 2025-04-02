import { type Mock } from 'vitest';
import { setupI18n } from '@lingui/core';

import { renderApp, screen } from '@/testing';
import { I18n, fallbackLocale, getAppI18n } from '@/utilities/locale';

import { LocaleProvider } from './locale-provider';

vi.mock('@/utilities/locale', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/utilities/locale')>();
  return {
    ...original,
    getAppI18n: vi.fn(original.getAppI18n),
  };
});

describe(LocaleProvider, () => {
  describe('without messages loaded', () => {
    let i18n: I18n;

    beforeEach(() => {
      i18n = setupI18n();
      (getAppI18n as Mock<typeof getAppI18n>).mockImplementation(() => i18n);
    });

    test('does not display children', () => {
      renderApp(
        <LocaleProvider>
          <div data-slot="Content" />
        </LocaleProvider>,
        { providers: { i18n: false } },
      );

      expect(screen.queryByTestId('Content')).not.toBeInTheDocument();
    });
  });

  describe('with messages loaded', () => {
    let i18n: I18n;

    beforeEach(async () => {
      const { messages } = await import(`../../locales/${fallbackLocale}.po`);

      i18n = setupI18n({
        locale: fallbackLocale,
        messages: { [fallbackLocale]: messages },
      });
      (getAppI18n as Mock<typeof getAppI18n>).mockImplementation(() => i18n);
    });

    test('displays children', () => {
      renderApp(
        <LocaleProvider>
          <div data-slot="Content" />
        </LocaleProvider>,
        { providers: { i18n: false } },
      );

      expect(screen.getByTestId('Content')).toBeInTheDocument();
    });
  });
});
