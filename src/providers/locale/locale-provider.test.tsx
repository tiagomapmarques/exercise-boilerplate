import { Trans, useLingui } from '@lingui/react';

import {
  act,
  ControlledPromise,
  type Mock,
  mockConsole,
  render,
  screen,
  waitFor,
} from '@/testing';

import { LocaleProvider } from './locale-provider';
import { useLocale } from './use-locale';
import { loadLocale } from './utilities';

vi.mock('./utilities', async (importActual) => {
  const original = await importActual<typeof import('./utilities')>();
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

    expect(loadLocale).toHaveBeenCalledOnce();
    const [i18n] = (loadLocale as Mock<typeof loadLocale>).mock.calls[0];

    expect(i18n?.locale).toBe('');
    expect(i18n?.messages).toEqual({});
    expect(screen.queryByTestId('Content')).not.toBeInTheDocument();

    await act(() => loader.resolve());

    expect(i18n?.locale).toBe('custom-locale');
    expect(i18n?.messages).toEqual({ 'mock-key': 'Mock Value' });
    expect(screen.getByTestId('Content')).toBeInTheDocument();
  });

  it('displays fallback while loading', async () => {
    render(
      <LocaleProvider fallback={<div data-slot="Fallback" />}>
        <TestingComponent />
      </LocaleProvider>,
      { providers: { i18n: false } },
    );

    expect(screen.getByTestId('Fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('Content')).not.toBeInTheDocument();

    await act(() => loader.resolve());

    expect(screen.queryByTestId('Fallback')).not.toBeInTheDocument();
    expect(screen.getByTestId('Content')).toBeInTheDocument();
  });

  it('does not load messages more than once', async () => {
    const { rerender } = render(
      <LocaleProvider>
        <TestingComponent />
      </LocaleProvider>,
      { providers: { i18n: false } },
    );

    await act(() => loader.resolve());

    expect(loadLocale).toHaveBeenCalledOnce();

    rerender();

    expect(loadLocale).toHaveBeenCalledOnce();
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

  it('accepts initial locale and empty messages', () => {
    const messages = {};

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
    const Consumer = () => {
      const [locale] = useLocale();
      return (
        <div data-slot="Content" data-locale={locale}>
          <Trans id="mock-key" />
        </div>
      );
    };

    render(
      <LocaleProvider>
        <Consumer />
      </LocaleProvider>,
      { providers: { i18n: false } },
    );

    await act(() => loader.resolve());

    expect(screen.getByTestId('Content')).toHaveAttribute(
      'data-locale',
      'custom-locale',
    );
    expect(screen.getByTestId('Content')).toHaveTextContent('Mock Value');
  });

  it('can be used multiple times on a single page', () => {
    const messagesEn = { 'mock-key': 'English' };
    const messagesDe = { 'mock-key': 'Deutsch' };
    const messagesFr = { 'mock-key': 'Français' };

    const Consumer = ({ id }: { id: string }) => {
      const { i18n } = useLingui();
      return (
        <div data-slot={id}>
          <Trans id="mock-key" />
          &nbsp;
          {i18n.t({ id: 'mock-key' })}
        </div>
      );
    };

    render(
      <>
        <LocaleProvider initialLocale="en-GB" initialMessages={messagesEn}>
          <Consumer id="english" />

          <LocaleProvider initialLocale="fr-FR" initialMessages={messagesFr}>
            <Consumer id="french" />
          </LocaleProvider>
        </LocaleProvider>

        <LocaleProvider initialLocale="de-DE" initialMessages={messagesDe}>
          <Consumer id="german" />
        </LocaleProvider>
      </>,
      { providers: { i18n: false } },
    );

    expect(screen.getByTestId('english')).toHaveTextContent('English English');
    expect(screen.getByTestId('french')).toHaveTextContent('Français Français');
    expect(screen.getByTestId('german')).toHaveTextContent('Deutsch Deutsch');

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
