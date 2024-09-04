import { test, expect } from '@playwright/test';

test('create update delete', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'bookkeeping demo' })).toBeVisible()

  const summary = page.getByText('summary:')
  await expect(summary).toContainText(`nothing to report :)`)

  const record0 = page.getByLabel('entry').nth(0)
  await record0.getByLabel('debit account').fill('liability')
  await record0.getByLabel('credit account').fill('asset')
  await record0.getByLabel('amount').fill('100')

  await page.getByRole('button', { name: 'add entry' }).click()

  const record1 = page.getByLabel('entry').nth(1)
  await record1.getByLabel('debit account').fill('expense')
  await record1.getByLabel('credit account').fill('liability')
  await record1.getByLabel('amount').fill('50')

  await expect(summary).toContainText(`liability: debit 50`)
  await expect(summary).toContainText(`asset: credit 100`)
  await expect(summary).toContainText(`expense: debit 50`)

  await record1.getByRole('button', { name: 'delete' }).click()

  await expect(summary).toContainText(`liability: debit 100`)
  await expect(summary).toContainText(`asset: credit 100`)
})

test('persist journal', async ({ page }) => {
  await page.goto('/')

  const record0 = page.getByLabel('entry').nth(0)
  await record0.getByLabel('date').fill('2024-01-01')
  await record0.getByLabel('debit account').fill('liability')
  await record0.getByLabel('credit account').fill('asset')
  await record0.getByLabel('amount').fill('100')
  await record0.getByLabel('memo').fill('the memo')

  await page.getByRole('button', { name: 'add entry' }).click()

  const record1 = page.getByLabel('entry').nth(1)
  await record1.getByLabel('debit account').fill('expense')
  await record1.getByLabel('credit account').fill('liability')
  await record1.getByLabel('amount').fill('50')
  await record1.getByRole('button', { name: 'delete' }).click()

  await page.reload()

  await expect(record0.getByLabel('date')).toHaveValue('2024-01-01')
  await expect(record0.getByLabel('memo')).toHaveValue('the memo')

  const summary = page.getByText('summary:')

  await expect(summary).toContainText(`liability: debit 100`)
  await expect(summary).toContainText(`asset: credit 100`)
})

test('load sample journal', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'load sample journal' }).click()
  await page.getByRole('button', { name: 'are you sure' }).click()

  await page.reload()

  const summary = page.getByText('summary:')

  await expect(summary).toContainText(`income: credit 7500`)
})
