import { renderApp, screen, userEvent } from '@/testing';

import { NotFoundContainer } from './not-found-container';

describe(NotFoundContainer, () => {
  test('displays error text', () => {
    renderApp(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(
      screen.getByText('Oops… Something went wrong on our end'),
    ).toBeVisible();
  });

  test('does not display a title', async () => {
    renderApp(<NotFoundContainer />, {
      providers: { router: true },
    });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('navigates to start', async () => {
    const { providers } = renderApp(<NotFoundContainer />, {
      providers: { router: { initialEntries: ['/unknown'] } },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Go to start' }));

    expect(providers.router?.latestLocation.pathname).toEqual('/');
  });
});
