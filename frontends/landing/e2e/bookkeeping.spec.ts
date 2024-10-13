import { test, expect } from '@playwright/test'

test('summarize one movement', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('assets')
  await page.getByLabel('debit').fill('4096')
  await page.getByRole('button', { name: 'add line' }).click()
  await page.getByLabel('account').nth(1).fill('liabilities')
  await page.getByLabel('credit').nth(1).fill('4096')

  await expect(page.getByText('info: ')).toContainText('movement is balanced')

  const summary = page.getByText('summary: ')
  await expect(summary).toContainText('assets: 4096')
  await expect(summary).toContainText('liabilities: 4096')
})

test('write credit after debit wipes credit', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('assets')
  await page.getByLabel('debit').fill('4096')
  await page.getByLabel('credit').fill('8192')
  await expect(page.getByLabel('debit')).toHaveValue('')

  await expect(page.getByText('warning: ')).toContainText(
    'movement is not balanced: credits is 8192 greater than debits',
  )

  const summary = page.getByText('summary: ')
  await expect(summary).toContainText('assets: (8192)')
})

test('warn that movement is not balanced', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('account').fill('assets')
  await page.getByLabel('debit').fill('8192')

  await page.getByRole('button', { name: 'add line' }).click()
  await page.getByLabel('account').nth(1).fill('liabilities')
  await page.getByLabel('credit').nth(1).fill('2048')

  await page.getByRole('button', { name: 'add line' }).click()
  await page.getByLabel('account').nth(2).fill('equity')
  await page.getByLabel('credit').nth(2).fill('2048')

  await expect(page.getByText('warning: ')).toContainText(
    'movement is not balanced: debits is 4096 greater than credits',
  )
})
