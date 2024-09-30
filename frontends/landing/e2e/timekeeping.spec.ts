import { expect, test } from '@playwright/test'

test('start with punch in', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByRole('button', { name: 'punch in' }).click()
})

test('start with empty entry', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByRole('button', { name: 'add empty entry' }).click()
})
