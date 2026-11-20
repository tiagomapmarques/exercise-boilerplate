import { expect, test } from 'playwright/test';

test.describe('switching the locale', () => {
  test('displays the selected locale and keeps it after navigating', async ({
    page,
  }) => {
    await page.goto('./');

    await expect(
      page.getByRole('button', { name: 'Great Britain English (GB)' }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: 'Great Britain English (GB)' })
      .click();

    await page
      .getByRole('menuitem', { name: 'Deutschland Deutsch (DE)' })
      .click();

    await expect(
      page.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Über' }).click();

    await expect(
      page.getByRole('button', { name: 'Deutschland Deutsch (DE)' }),
    ).toBeVisible();
  });
});
