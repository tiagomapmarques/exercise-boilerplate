import { act, renderApp, screen, userEvent } from '@/testing';

import { UnexpectedErrorContainer } from './unexpected-error-container';

describe(UnexpectedErrorContainer, () => {
  test('displays a title', async () => {
    renderApp(<UnexpectedErrorContainer />, {
      providers: { router: true },
    });

    expect(
      screen.queryByRole('heading', { name: 'Unexpected error' }),
    ).toBeVisible();
  });

  test('displays error text', () => {
    renderApp(<UnexpectedErrorContainer />, {
      providers: { router: true },
    });

    expect(
      screen.getByText('Oops… something went wrong on our end'),
    ).toBeVisible();
  });

  test('goes back to the previous page', async () => {
    const { providers } = renderApp(<UnexpectedErrorContainer />, {
      providers: { router: { initialEntries: ['/initial-route'] } },
    });

    act(() => {
      providers.router?.history.push('/');
    });

    expect(providers.router?.latestLocation.pathname).toBe('/');

    await userEvent.click(screen.getByRole('button', { name: 'Go back' }));

    expect(providers.router?.latestLocation.pathname).toBe('/initial-route');
  });
});
