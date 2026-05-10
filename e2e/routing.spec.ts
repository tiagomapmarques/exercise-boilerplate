import { expect, test } from 'playwright/test';

test('navigates from home to about', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();

  await page.getByRole('link', { name: 'About' }).click();

  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
});

test('navigates from about to home', async ({ page }) => {
  await page.goto('/about');

  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();

  await page.getByRole('link', { name: 'Home' }).click();

  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
});

test('displays the not found page for an unknown route', async ({ page }) => {
  await page.goto('/unknown');

  await expect(
    page.getByRole('heading', { name: '404 Not found' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Go to start' }).click();

  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
});
