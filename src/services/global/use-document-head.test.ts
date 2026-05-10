import { setupI18n } from '@lingui/core';

import { renderHook } from '@/testing';
import { fallbackLocale } from '@/providers/locale';

import { useDocumentHead } from './use-document-head';

describe(useDocumentHead, () => {
  it('updates app title', async () => {
    const { providers } = renderHook(useDocumentHead, {
      providers: {
        router: true,
        i18n: { locale: 'de-DE' },
      },
    });

    await providers.waitForRouter?.();

    expect(document.title).toBe('Exercise boilerplate');
  });

  it('updates document language attribute to active locale', async () => {
    const { providers } = renderHook(useDocumentHead, {
      providers: {
        router: true,
        i18n: { locale: 'de-DE' },
      },
    });

    await providers.waitForRouter?.();

    expect(document.documentElement.lang).toBe('de-DE');
  });

  it('does not update title with empty messages but still update language', async () => {
    const i18n = setupI18n({
      locale: fallbackLocale,
      messages: { [fallbackLocale]: {} },
    });

    const { providers } = renderHook(useDocumentHead, {
      providers: {
        router: true,
        i18n: { i18n },
      },
    });

    await providers.waitForRouter?.();

    expect(document.title).toBe('Vitest Browser Tester');
    expect(document.documentElement.lang).toBe(fallbackLocale);
  });

  it('appends page title from matched route getTitle', async () => {
    const { providers } = renderHook(useDocumentHead, {
      providers: {
        router: {
          getTitle: () => 'Custom page title',
        },
        i18n: true,
      },
    });

    await providers.waitForRouter?.();

    expect(document.title).toBe('Exercise boilerplate - Custom page title');
  });
});
