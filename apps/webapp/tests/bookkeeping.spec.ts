import { test, expect } from '@playwright/test';

test('summarize credit movement', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'bookkeeping demo' })).toBeVisible();

  const summary = page.getByText('summary')
  await expect(summary).toContainText(`nothing to report :)`)

  const record0 = page.getByLabel('entry').nth(0)
  await record0.getByLabel('account').fill('liability')
  await record0.getByLabel('debit').fill('100')
  await record0.getByLabel('credit').fill('0')

  page.getByRole('button', { name: 'add entry' }).click()

  const record1 = page.getByLabel('entry').nth(1)
  await record1.getByLabel('account').fill('asset')
  await record1.getByLabel('debit').fill('0')
  await record1.getByLabel('credit').fill('100')

  await expect(summary).toContainText(`liability: debit 100`)
  await expect(summary).toContainText(`asset: credit 100`)
});
