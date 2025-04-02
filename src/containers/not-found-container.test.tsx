import { renderApp, screen, userEvent } from '@/testing';

import { NotFoundContainer } from './not-found-container';

describe(NotFoundContainer, () => {
  test('displays a title', async () => {
    renderApp(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(
      screen.queryByRole('heading', { name: '404 Not found' }),
    ).toBeVisible();
  });

  test('displays error text', () => {
    renderApp(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(
      screen.getByText('Oops… something went wrong on our end'),
    ).toBeVisible();
  });

  test('navigates to start', async () => {
    const { providers } = renderApp(<NotFoundContainer />, {
      providers: { router: { initialEntries: ['/unknown'] } },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Go to start' }));

    expect(providers.router?.latestLocation.pathname).toEqual('/');
  });
});
