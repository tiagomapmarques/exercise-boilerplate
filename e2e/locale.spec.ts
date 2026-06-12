import { expect, test } from 'playwright/test';

test('switches locale', async ({ page }) => {
  await page.goto('/');

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
});

test('locale persists after navigation', async ({ page }) => {
  await page.goto('/');

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
