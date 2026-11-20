import { render, screen, userEvent } from '@/testing';

import { NotFoundPage } from './not-found-page';

describe(NotFoundPage, () => {
  it('displays a title', async () => {
    render(<NotFoundPage />, {
      providers: { router: true },
    });

    expect(
      await screen.findByRole('heading', { name: '404 Not found' }),
    ).toBeVisible();
  });

  it('displays error text', async () => {
    render(<NotFoundPage />, {
      providers: { router: true },
    });

    expect(await screen.findByText('This page does not exist')).toBeVisible();
  });

  it('navigates to start', async () => {
    const { providers } = render(<NotFoundPage />, {
      providers: { router: { initialEntries: ['/unknown'] } },
    });

    expect(providers.router?.instance.latestLocation.pathname).toBe('/unknown');

    await userEvent.click(
      await screen.findByRole('button', { name: 'Go to start' }),
    );

    expect(providers.router?.instance.latestLocation.pathname).toBe('/');
  });
});
