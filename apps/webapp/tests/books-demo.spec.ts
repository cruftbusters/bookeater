import { test, expect } from '@playwright/test';

test('summarize credit movement', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Books Demo' })).toBeVisible();

  await page.getByLabel('account').nth(0).fill('liability')
  await page.getByLabel('debit').nth(0).fill('100')
  await page.getByLabel('credit').nth(0).fill('0')

  await page.getByLabel('account').nth(1).fill('asset')
  await page.getByLabel('debit').nth(1).fill('0')
  await page.getByLabel('credit').nth(1).fill('100')

  const summary = page.getByText('summary')
  await expect(summary).toContainText(`liability: debit 100`)
  await expect(summary).toContainText(`asset: credit 100`)
});
