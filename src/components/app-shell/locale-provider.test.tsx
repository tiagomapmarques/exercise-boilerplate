import type { Mock } from 'vitest';
import { setupI18n } from '@lingui/core';

import { render, screen } from '@/testing';
import { fallbackLocale, type I18n } from '@/utilities/locale';

// biome-ignore lint/style/noRestrictedImports: Intended use
import { getAppI18n } from './i18n';
import { LocaleProvider } from './locale-provider';

vi.mock('./i18n', async (importOriginal) => {
  const original = await importOriginal<typeof import('./i18n')>();
  return {
    ...original,
    getAppI18n: vi.fn(original.getAppI18n),
  };
});

describe(LocaleProvider, () => {
  let i18n: I18n;

  beforeEach(() => {
    (getAppI18n as Mock<typeof getAppI18n>).mockImplementation(() => i18n);
  });

  describe('without messages loaded', () => {
    beforeEach(() => {
      i18n = setupI18n();
    });

    it('does not display children', () => {
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
    beforeEach(async () => {
      const { messages } = await import(`../../locales/${fallbackLocale}.po`);

      i18n = setupI18n({
        locale: fallbackLocale,
        messages: { [fallbackLocale]: messages },
      });
    });

    it('displays children', () => {
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
