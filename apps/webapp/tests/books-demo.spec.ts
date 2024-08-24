import { test, expect } from '@playwright/test';

test('books demo', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Books Demo' })).toBeVisible();
});
