import { expect, test } from 'playwright/test';

test('dev tools are not bundled', async ({ page, baseURL }) => {
  const isDevelopment = !baseURL?.includes(':8080');

  // biome-ignore lint/suspicious/noSkippedTests: Test is invalid with development bundle
  test.skip(isDevelopment, 'test is invalid with development bundle');

  await page.goto('/');

  await expect(page.getByRole('heading')).toBeVisible();

  await expect(page.getByTestId('tanstack_devtools')).not.toBeAttached();
});
