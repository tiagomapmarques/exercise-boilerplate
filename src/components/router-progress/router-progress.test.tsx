import { createNprogress } from '@mantine/nprogress';

import { act, render, screen, waitFor } from '@/testing';

import { RouterProgress } from './router-progress';

vi.mock('@mantine/nprogress', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/nprogress')>();
  const nProgress = original.createNprogress();
  nProgress[1].start = vi.fn(nProgress[1].start);
  nProgress[1].complete = vi.fn(nProgress[1].complete);
  nProgress[1].cleanup = vi.fn(nProgress[1].cleanup);

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

  it('starts, completes and cleans up progress bar', async () => {
    const [, { start, complete, cleanup }] = createNprogress();

    const { providers, unmount } = render(<RouterProgress />, {
      providers: { router: { initialEntries: ['/about'] } },
    });

    await providers.waitForRouter?.();

    expect(start).not.toHaveBeenCalled();
    expect(complete).not.toHaveBeenCalled();
    expect(cleanup).not.toHaveBeenCalled();

    let navigation: Promise<void> | undefined;
    act(() => {
      navigation = providers.router?.navigate({ to: '/' });
    });

    expect(start).toHaveBeenCalledTimes(1);
    expect(complete).not.toHaveBeenCalled();
    expect(cleanup).not.toHaveBeenCalled();

    await waitFor(() => navigation);

    expect(start).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    unmount();

    expect(start).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
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
