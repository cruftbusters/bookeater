import { test, expect } from '@playwright/test'

test('movement is balanced', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('assets')
  await page.getByLabel('debit').fill('4096')

  await page.getByRole('button', { name: 'add line' }).click()
  await page.getByLabel('account').nth(1).fill('liabilities')
  await page.getByLabel('credit').nth(1).fill('2048')

  await page.getByRole('button', { name: 'add line' }).click()
  await page.getByLabel('account').nth(2).fill('equity')
  await page.getByLabel('credit').nth(2).fill('2048')

  const summary = page.getByText('summary: ')
  await expect(summary).toContainText('movement is balanced')
  await expect(summary).toContainText('assets: 4096')
  await expect(summary).toContainText('liabilities: 2048')
  await expect(summary).toContainText('equity: 2048')
})

test('debits is greater than credit', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('assets')
  await page.getByLabel('debit').fill('8192')

  await expect(page.getByText('summary: ')).toContainText(
    'warning: movement is not balanced: debits is 8192 greater than credits',
  )
})

test('credits is greater than debits', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('liabilities')
  await page.getByLabel('credit').fill('8192')
  await expect(page.getByLabel('debit')).toHaveValue('')

  await expect(page.getByText('summary: ')).toContainText(
    'warning: movement is not balanced: credits is 8192 greater than debits',
  )
})

test('write credit wipes debit', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('assets')
  await page.getByLabel('debit').fill('4096')
  await page.getByLabel('credit').fill('8192')
  await expect(page.getByText('summary: ')).toContainText('assets: (8192)')
})
