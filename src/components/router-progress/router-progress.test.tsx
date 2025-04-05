import { Mock } from 'vitest';
import { nprogress } from '@mantine/nprogress';

import { act, renderApp, screen, waitFor } from '@/testing';

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
  let mockCalls: string[];

  beforeEach(() => {
    mockCalls = [];

    (nprogress.start as Mock<typeof nprogress.start>).mockImplementation(() =>
      mockCalls.push('start'),
    );
    (nprogress.complete as Mock<typeof nprogress.complete>).mockImplementation(
      () => mockCalls.push('complete'),
    );
  });

  test('displays the progress bar', () => {
    renderApp(<RouterProgress />, {
      providers: { router: true },
    });

    expect(
      screen.getByRole('progressbar', { name: 'Page loading' }),
    ).toBeInTheDocument();
  });

  test('does not start progress on the first run', async () => {
    renderApp(<RouterProgress />, {
      providers: { router: true },
    });

    await waitFor(() => {
      expect(mockCalls.includes('complete')).toBeTruthy();
    });

    expect(mockCalls.includes('start')).toBeFalsy();
  });

  test('starts and completes progress when user navigates', async () => {
    const { providers } = renderApp(<RouterProgress />, {
      providers: { router: true },
    });

    await waitFor(() => {
      expect(mockCalls).toEqual(['complete']);
    });
    mockCalls = [];

    act(() => {
      providers.router?.navigate({ to: '/' });
    });

    await waitFor(() => {
      expect(mockCalls).toEqual(['start', 'complete']);
    });
  });
});
