import { expect, test } from 'playwright/test';

test.describe('the health endpoint', () => {
  test('responds with a success status', async ({ request }) => {
    const response = await request.get('/health');

    expect(response.status()).toBe(200);
  });
});
