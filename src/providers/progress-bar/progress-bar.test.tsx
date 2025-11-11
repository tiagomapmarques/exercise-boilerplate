import { render, screen } from '@/testing';

import { ProgressBar } from './progress-bar';

describe(ProgressBar, () => {
  it('throws an error without an ProgressBarProvider', () => {
    expect(() =>
      render(<ProgressBar label="Mock label" />, {
        providers: { i18n: false },
      }),
    ).toThrowError(
      'ProgressBar component was used without ProgressBarProvider.',
    );
  });

  it('gets actions for the progress bar', () => {
    render(<ProgressBar label="Mock label" />, {
      providers: {
        i18n: false,
        progressBar: true,
      },
    });

    expect(
      screen.getByRole('progressbar', { name: 'Mock label' }),
    ).not.toBeVisible();
  });
});
