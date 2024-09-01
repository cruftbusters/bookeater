import { test, expect } from '@playwright/test';

test('summarize credit movement', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'bookkeeping demo' })).toBeVisible();

  const summary = page.getByText('summary')
  await expect(summary).toContainText(`nothing to report :)`)

  const record0 = page.getByLabel('entry').nth(0)
  await record0.getByLabel('debit account').fill('liability')
  await record0.getByLabel('credit account').fill('asset')
  await record0.getByLabel('amount').fill('100')

  page.getByRole('button', { name: 'add entry' }).click()

  const record1 = page.getByLabel('entry').nth(1)
  await record1.getByLabel('debit account').fill('expense')
  await record1.getByLabel('credit account').fill('liability')
  await record1.getByLabel('amount').fill('50')

  await expect(summary).toContainText(`liability: debit 50`)
  await expect(summary).toContainText(`asset: credit 100`)
  await expect(summary).toContainText(`expense: debit 50`)
});
