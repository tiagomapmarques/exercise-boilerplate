import { nprogress } from '@mantine/nprogress';

import { render, screen, waitFor } from '@/testing';

import { RouterProgress } from './router-progress';

vi.mock('@mantine/nprogress', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/nprogress')>();
  return {
    ...original,
    nprogress: {
      ...original.nprogress,
      start: vi.fn(original.nprogress.start),
      complete: vi.fn(original.nprogress.complete),
    },
  };
});

describe(RouterProgress, () => {
  it('displays the progress bar', async () => {
    render(<RouterProgress />, {
      providers: { router: { initialEntries: ['/about'] } },
    });

    expect(
      await screen.findByRole('progressbar', { name: 'Page loading' }),
    ).not.toBeVisible();

    expect(screen.getByTestId('RouterProgress')).toBeVisible();
  });

  it('starts and completes progress when user navigates', async () => {
    const { providers } = render(<RouterProgress />, {
      providers: { router: { initialEntries: ['/about'] } },
    });

    await providers.router?.waitForLoad();

    expect(nprogress.start).not.toHaveBeenCalled();
    expect(nprogress.complete).not.toHaveBeenCalled();

    await providers.router?.navigate({ to: '/' });

    expect(nprogress.start).toHaveBeenCalledTimes(1);
    expect(nprogress.complete).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(nprogress.complete).toHaveBeenCalledTimes(1);
    });
  });
});
