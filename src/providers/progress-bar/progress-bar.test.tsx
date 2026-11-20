import { act, render, screen, waitFor } from '@/testing';

import { ProgressBar } from './progress-bar';

describe(ProgressBar, () => {
  it('throws an error without a ProgressBarProvider', () => {
    expect(() =>
      render(<ProgressBar label="Mock label" />, {
        providers: { i18n: false },
      }),
    ).toThrow('ProgressBar component was used without ProgressBarProvider.');
  });

  it('becomes visible once the progress moves', async () => {
    const { providers } = render(<ProgressBar label="Mock label" />, {
      providers: {
        i18n: false,
        progressBar: true,
      },
    });

    expect(
      screen.getByRole('progressbar', { name: 'Mock label' }),
    ).not.toBeVisible();

    act(() => {
      providers.progressBar?.actions?.set(20);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('progressbar', { name: 'Mock label' }),
      ).toBeVisible();
    });
  });
});
