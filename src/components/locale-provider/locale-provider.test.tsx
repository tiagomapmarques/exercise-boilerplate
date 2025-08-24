import type { Mock } from 'vitest';
import { Trans, useLingui } from '@lingui/react';

import { act, ControlledPromise, render, screen } from '@/testing';

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

    rerender(
      <LocaleProvider>
        <TestingComponent />
      </LocaleProvider>,
    );

    expect(loadLocale).toHaveBeenCalledTimes(1);
  });

  it('accepts initial locale and messages', () => {
    const messages = { 'mock-key': 'Mock Value 2' };

    render(
      <LocaleProvider locale="de-DE" messages={messages}>
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
});
