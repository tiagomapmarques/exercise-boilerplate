import { expect, test } from 'playwright/test';

test('health check endpoint responds', async ({ request }) => {
  const response = await request.get('/health');

  expect(response.status()).toBe(200);
});
