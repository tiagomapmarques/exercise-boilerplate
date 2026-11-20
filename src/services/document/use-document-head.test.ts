import { setupI18n } from '@lingui/core';

import {
  initialDocumentTitle,
  mockObjectProperty,
  renderHook,
} from '@/testing';
import { fallbackLocale } from '@/providers/locale';

import { useDocumentHead } from './use-document-head';

describe(useDocumentHead, () => {
  const documentTitle = mockObjectProperty(document, 'title');
  const documentLanguage = mockObjectProperty(document.documentElement, 'lang');

  it('updates app title', async () => {
    expect(document.title).toBe(initialDocumentTitle);

    const { providers } = renderHook(useDocumentHead, {
      providers: {
        router: true,
        i18n: true,
      },
    });

    await providers.router?.waitForReady();

    expect(document.title).toBe('Exercise boilerplate');
  });

  it('updates document language attribute to active locale', async () => {
    const { providers } = renderHook(useDocumentHead, {
      providers: {
        router: true,
        i18n: { locale: 'de-DE' },
      },
    });

    await providers.router?.waitForReady();

    expect(document.documentElement.lang).toBe('de-DE');
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

    await providers.router?.waitForReady();

    expect(document.title).toBe('Exercise boilerplate - Custom page title');
  });

  it('interpolates values into the page title', async () => {
    const i18n = setupI18n({
      locale: fallbackLocale,
      messages: {
        [fallbackLocale]: {
          'labels.app.name': 'Exercise boilerplate',
          'test.greeting': 'Hello, {name}!',
        },
      },
    });

    const { providers } = renderHook(useDocumentHead, {
      initialProps: { name: 'World' },
      providers: {
        router: {
          getTitle: (i18nInstance, values) =>
            i18nInstance.t({ id: 'test.greeting', values }),
        },
        i18n: { i18n },
      },
    });

    await providers.router?.waitForReady();

    expect(document.title).toBe('Exercise boilerplate - Hello, World!');
  });

  describe('no translations are loaded', () => {
    const i18n = setupI18n({
      locale: fallbackLocale,
      messages: { [fallbackLocale]: {} },
    });

    it('does not update the title', async () => {
      const { providers } = renderHook(useDocumentHead, {
        providers: {
          router: true,
          i18n: { i18n },
        },
      });

      await providers.router?.waitForReady();

      expect(document.title).toBe(initialDocumentTitle);
    });

    it('still updates the document language', async () => {
      const { providers } = renderHook(useDocumentHead, {
        providers: {
          router: true,
          i18n: { i18n },
        },
      });

      await providers.router?.waitForReady();

      expect(document.documentElement.lang).toBe(fallbackLocale);
    });
  });

  describe('the document is already up to date', () => {
    beforeEach(() => {
      document.title = 'Exercise boilerplate';
      document.documentElement.lang = fallbackLocale;
      documentTitle.setter.mockClear();
      documentLanguage.setter.mockClear();
    });

    it('does not update the title', async () => {
      const { providers } = renderHook(useDocumentHead, {
        providers: {
          router: true,
          i18n: true,
        },
      });

      await providers.router?.waitForReady();

      expect(documentTitle.setter).not.toHaveBeenCalled();
    });

    it('does not update the document language', async () => {
      const { providers } = renderHook(useDocumentHead, {
        providers: {
          router: true,
          i18n: true,
        },
      });

      await providers.router?.waitForReady();

      expect(documentLanguage.setter).not.toHaveBeenCalled();
    });
  });
});
