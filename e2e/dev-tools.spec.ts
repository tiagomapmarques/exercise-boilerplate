import { expect, test } from 'playwright/test';

import { isDevelopment } from '~/testing';

test.describe('the production bundle', () => {
  test('leaves the dev tools out', async ({ page, baseURL }) => {
    // biome-ignore lint/suspicious/noSkippedTests: Test is invalid with development bundle
    test.skip(
      isDevelopment(baseURL),
      'test is invalid with development bundle',
    );

    await page.goto('./');

    await expect(page.getByRole('heading')).toBeVisible();

    // The dev tools mark their root with the default test ID attribute
    await expect(
      page.locator('[data-testid="tanstack_devtools"]'),
    ).not.toBeAttached();
  });
});
