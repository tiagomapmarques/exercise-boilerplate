import type { Mock } from 'vitest';
import { Trans, useLingui } from '@lingui/react';

import {
  act,
  ControlledPromise,
  mockConsole,
  render,
  screen,
  waitFor,
} from '@/testing';

import { LocaleProvider } from './locale-provider';
import { useLocale } from './use-locale';
import { loadLocale } from './utilities';

vi.mock('./utilities', async (importOriginal) => {
  const original = await importOriginal<typeof import('./utilities')>();
  return {
    ...original,
    loadLocale: vi.fn(original.loadLocale),
  };
});

describe(LocaleProvider, () => {
  let loader: ControlledPromise;

  const TestingComponent = () => {
    const { i18n } = useLingui();
    return (
      <div
        data-slot="Content"
        data-locale={i18n.locale}
        data-messages={JSON.stringify(i18n.messages)}
      />
    );
  };

  beforeEach(() => {
    loader = new ControlledPromise();

    (loadLocale as Mock<typeof loadLocale>).mockImplementation(async (i18n) => {
      await loader.wait();
      i18n?.loadAndActivate({
        locale: i18n.locale || 'custom-locale',
        messages: { 'mock-key': 'Mock Value' },
      });
    });
  });

  it('loads messages before displaying children', async () => {
    render(
      <LocaleProvider>
        <TestingComponent />
      </LocaleProvider>,
      { providers: { i18n: false } },
    );

    expect(loadLocale).toHaveBeenCalledTimes(1);
    const i18n = (loadLocale as Mock<typeof loadLocale>).mock.calls[0][0];

    expect(i18n?.locale).toBe('');
    expect(i18n?.messages).toEqual({});
    expect(screen.queryByTestId('Content')).not.toBeInTheDocument();

    await act(() => loader.continue());

    expect(i18n?.locale).toBe('custom-locale');
    expect(i18n?.messages).toEqual({ 'mock-key': 'Mock Value' });
    expect(screen.getByTestId('Content')).not.toBeVisible();
  });

  it('does not load messages more than once', async () => {
    const { rerender } = render(
      <LocaleProvider>
        <TestingComponent />
      </LocaleProvider>,
      { providers: { i18n: false } },
    );

    await act(() => loader.continue());

    expect(loadLocale).toHaveBeenCalledTimes(1);

    rerender();

    expect(loadLocale).toHaveBeenCalledTimes(1);
  });

  it('accepts initial locale and messages', () => {
    const messages = { 'mock-key': 'Mock Value 2' };

    render(
      <LocaleProvider initialLocale="de-DE" initialMessages={messages}>
        <TestingComponent />
      </LocaleProvider>,
      { providers: { i18n: false } },
    );

    expect(loadLocale).not.toHaveBeenCalled();

    expect(screen.getByTestId('Content')).toHaveAttribute(
      'data-locale',
      'de-DE',
    );
    expect(screen.getByTestId('Content')).toHaveAttribute(
      'data-messages',
      JSON.stringify(messages),
    );
  });

  it('works in tandem with `useLocale` and `Trans`', async () => {
    const ConsumerComponent = () => {
      const [locale] = useLocale();
      return (
        <div data-slot="Content" data-locale={locale}>
          <Trans id="mock-key" />
        </div>
      );
    };

    render(
      <LocaleProvider>
        <ConsumerComponent />
      </LocaleProvider>,
      { providers: { i18n: false } },
    );

    await act(() => loader.continue());

    expect(screen.getByTestId('Content')).toHaveAttribute(
      'data-locale',
      'custom-locale',
    );
    expect(screen.getByTestId('Content')).toHaveTextContent('Mock Value');
  });

  it('can be used multiple times on a single page', () => {
    const messagesEn = { 'mock-key': 'English' };
    const messagesDe = { 'mock-key': 'Deutch' };
    const messagesFr = { 'mock-key': 'Français' };

    const ConsumerComponent = () => {
      const { i18n } = useLingui();
      return (
        <div>
          <Trans id="mock-key" />
          &nbsp;
          {i18n.t({ id: 'mock-key' })}
        </div>
      );
    };

    render(
      <>
        <LocaleProvider initialLocale="en-GB" initialMessages={messagesEn}>
          <ConsumerComponent />

          <LocaleProvider initialLocale="fr-FR" initialMessages={messagesFr}>
            <ConsumerComponent />
          </LocaleProvider>
        </LocaleProvider>

        <LocaleProvider initialLocale="de-DE" initialMessages={messagesDe}>
          <ConsumerComponent />
        </LocaleProvider>
      </>,
      { providers: { i18n: false } },
    );

    expect(screen.getByText('English English')).toBeVisible();
    expect(screen.getByText('Deutch Deutch')).toBeVisible();
    expect(screen.getByText('Français Français')).toBeVisible();

    expect(screen.queryByText('mock-key')).not.toBeInTheDocument();
  });

  describe('error while loading', () => {
    const consoleError = mockConsole('error');
    const errorObject = new Error('Custom error');

    beforeEach(() => {
      (loadLocale as Mock<typeof loadLocale>).mockImplementation(
        () => new Promise((_, reject) => reject(errorObject)),
      );
    });

    it('handles errors loading locale/messages', async () => {
      render(
        <LocaleProvider>
          <TestingComponent />
        </LocaleProvider>,
        { providers: { i18n: false } },
      );

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(errorObject);
      });

      expect(screen.queryByTestId('Content')).not.toBeInTheDocument();
    });
  });
});
