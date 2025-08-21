import { render, screen, userEvent } from '@/testing';

import { NotFoundContainer } from './not-found-container';

describe(NotFoundContainer, () => {
  it('displays a title', async () => {
    render(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(
      await screen.findByRole('heading', { name: '404 Not found' }),
    ).toBeVisible();
  });

  it('displays error text', async () => {
    render(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(await screen.findByText('This page does not exist')).toBeVisible();
  });

  it('navigates to start', async () => {
    const { providers } = render(<NotFoundContainer />, {
      providers: { router: { initialEntries: ['/unknown'] } },
    });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Go to start' }),
    );

    expect(providers.router?.latestLocation.pathname).toEqual('/');
  });
});
