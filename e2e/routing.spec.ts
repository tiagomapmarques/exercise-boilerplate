import { expect, test } from 'playwright/test';

test.describe('moving between pages', () => {
  test('goes from home to about and back', async ({ page }) => {
    await page.goto('./');

    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();

    await page.getByRole('link', { name: 'About' }).click();

    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();

    await page.getByRole('link', { name: 'Home' }).click();

    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('offers a way back from an unknown page', async ({ page }) => {
    await page.goto('./unknown');

    await expect(
      page.getByRole('heading', { name: '404 Not found' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Go to start' }).click();

    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });
});
