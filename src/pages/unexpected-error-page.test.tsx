import { act, render, screen, userEvent } from '@/testing';

import { UnexpectedErrorPage } from './unexpected-error-page';

describe(UnexpectedErrorPage, () => {
  it('displays a title', async () => {
    render(<UnexpectedErrorPage />, {
      providers: { router: true },
    });

    expect(
      await screen.findByRole('heading', { name: 'Unexpected error' }),
    ).toBeVisible();
  });

  it('displays error text', async () => {
    render(<UnexpectedErrorPage />, {
      providers: { router: true },
    });

    expect(
      await screen.findByText('Oops… something went wrong on our end'),
    ).toBeVisible();
  });

  it('goes back to the previous page', async () => {
    const { providers } = render(<UnexpectedErrorPage />, {
      providers: { router: { initialEntries: ['/initial-route'] } },
    });

    expect(providers.router?.instance.latestLocation.pathname).toBe(
      '/initial-route',
    );

    act(() => providers.router?.instance.history.push('/'));

    expect(providers.router?.instance.latestLocation.pathname).toBe('/');

    await userEvent.click(
      await screen.findByRole('button', { name: 'Go back' }),
    );

    expect(providers.router?.instance.latestLocation.pathname).toBe(
      '/initial-route',
    );
  });
});
