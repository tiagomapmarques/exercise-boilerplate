import { createNprogress } from '@mantine/nprogress';

import { act, render, screen, waitFor } from '@/testing';

import { RouterProgress } from './router-progress';

vi.mock('@mantine/nprogress', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/nprogress')>();
  const nProgress = original.createNprogress();
  nProgress[1].start = vi.fn(nProgress[1].start);
  nProgress[1].complete = vi.fn(nProgress[1].complete);

  return {
    ...original,
    createNprogress: vi.fn(() => nProgress),
  };
});

describe(RouterProgress, () => {
  it('displays the progress bar', async () => {
    render(<RouterProgress />, {
      providers: { router: { initialEntries: ['/about'] } },
    });

    expect(
      await screen.findByRole('progressbar', { name: 'Loading' }),
    ).not.toBeVisible();
  });

  it('starts and completes progress when user navigates', async () => {
    const [, { start, complete }] = createNprogress();

    const { providers } = render(<RouterProgress />, {
      providers: { router: { initialEntries: ['/about'] } },
    });

    await providers.waitForRouter?.();

    expect(start).not.toHaveBeenCalled();
    expect(complete).not.toHaveBeenCalled();

    let navigation: Promise<void> | undefined;
    act(() => {
      navigation = providers.router?.navigate({ to: '/' });
    });

    expect(start).toHaveBeenCalledTimes(1);
    expect(complete).not.toHaveBeenCalled();

    await waitFor(() => navigation);

    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('does not re-create navigation progress on rerender', async () => {
    const { providers, rerender } = render(<RouterProgress />, {
      providers: { router: { initialEntries: ['/about'] } },
    });

    await providers.waitForRouter?.();

    expect(createNprogress).toHaveBeenCalledTimes(1);

    rerender();

    expect(createNprogress).toHaveBeenCalledTimes(1);
  });
});
