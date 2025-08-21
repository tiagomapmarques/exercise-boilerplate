import { act, render, screen, userEvent } from '@/testing';

import { UnexpectedErrorContainer } from './unexpected-error-container';

describe(UnexpectedErrorContainer, () => {
  it('displays a title', async () => {
    render(<UnexpectedErrorContainer />, {
      providers: { router: true },
    });

    expect(
      await screen.findByRole('heading', { name: 'Unexpected error' }),
    ).toBeVisible();
  });

  it('displays error text', async () => {
    render(<UnexpectedErrorContainer />, {
      providers: { router: true },
    });

    expect(
      await screen.findByText('Oops… something went wrong on our end'),
    ).toBeVisible();
  });

  it('goes back to the previous page', async () => {
    const { providers } = render(<UnexpectedErrorContainer />, {
      providers: { router: { initialEntries: ['/initial-route'] } },
    });

    act(() => providers.router?.history.push('/'));

    expect(providers.router?.latestLocation.pathname).toBe('/');

    await userEvent.click(
      await screen.findByRole('button', { name: 'Go back' }),
    );

    expect(providers.router?.latestLocation.pathname).toBe('/initial-route');
  });
});
