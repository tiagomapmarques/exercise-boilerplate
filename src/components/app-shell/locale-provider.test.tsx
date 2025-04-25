import { type Mock } from 'vitest';
import { setupI18n } from '@lingui/core';

import { render, screen } from '@/testing';
import { fallbackLocale, getAppI18n, type I18n } from '@/utilities/locale';

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
      render(
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
      render(
        <LocaleProvider>
          <div data-slot="Content" />
        </LocaleProvider>,
        { providers: { i18n: false } },
      );

      expect(screen.getByTestId('Content')).not.toBeVisible();
    });
  });
});
