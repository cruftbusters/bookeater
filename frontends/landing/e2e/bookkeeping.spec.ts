import { test, expect } from '@playwright/test'

test('summarize one movement', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('assets')
  await page.getByLabel('debit').fill('4096')
  await page.getByRole('button', { name: 'add line' }).click()
  await page.getByLabel('account').nth(1).fill('liabilities')
  await page.getByLabel('credit').nth(1).fill('4096')

  const summary = page.getByText('summary: ')
  await expect(summary).toContainText('assets: 4096')
  await expect(summary).toContainText('liabilities: 4096')
})
