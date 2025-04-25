import { act, render, screen, userEvent } from '@/testing';

import { UnexpectedErrorContainer } from './unexpected-error-container';

describe(UnexpectedErrorContainer, () => {
  test('displays a title', async () => {
    render(<UnexpectedErrorContainer />, {
      providers: { router: true },
    });

    expect(
      screen.queryByRole('heading', { name: 'Unexpected error' }),
    ).toBeVisible();
  });

  test('displays error text', () => {
    render(<UnexpectedErrorContainer />, {
      providers: { router: true },
    });

    expect(
      screen.getByText('Oops… something went wrong on our end'),
    ).toBeVisible();
  });

  test('goes back to the previous page', async () => {
    const { providers } = render(<UnexpectedErrorContainer />, {
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
