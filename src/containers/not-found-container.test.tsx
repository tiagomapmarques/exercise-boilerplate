import { render, screen, userEvent } from '@/testing';

import { NotFoundContainer } from './not-found-container';

describe(NotFoundContainer, () => {
  test('displays a title', async () => {
    render(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(
      screen.queryByRole('heading', { name: '404 Not found' }),
    ).toBeVisible();
  });

  test('displays error text', () => {
    render(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(screen.getByText('This page does not exist')).toBeVisible();
  });

  test('navigates to start', async () => {
    const { providers } = render(<NotFoundContainer />, {
      providers: { router: { initialEntries: ['/unknown'] } },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Go to start' }));

    expect(providers.router?.latestLocation.pathname).toEqual('/');
  });
});
