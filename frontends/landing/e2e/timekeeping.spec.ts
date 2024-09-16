import { expect, test } from '@playwright/test'

test('first shift', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await page.getByLabel('assignment').fill('some assignment')
  await page.getByLabel('timezone').fill('GMT-0700 (Pacific Daylight Time)')

  await page.getByRole('button', { name: 'add new entry' }).click()

  await page.getByLabel('punch start').nth(0).fill('2024-01-01 08:00:00')
  await page.getByLabel('punch end').nth(0).fill('2024-01-01 12:00:00')
  await expect(page.getByLabel('duration').nth(0)).toHaveValue('4h')

  await page.getByRole('button', { name: 'add new entry' }).click()

  await page.getByLabel('punch start').nth(1).fill('2024-01-01 12:30:00')
  await page.getByLabel('punch end').nth(1).fill('2024-01-01 16:15:00')
  await expect(page.getByLabel('duration').nth(1)).toHaveValue('3h45m')

  await page.getByRole('button', { name: 'punch in' }).click()
  await page.getByRole('button', { name: 'punch out' }).click()

  await expect(page.getByLabel('punch start').nth(2)).not.toBeEmpty()
  await expect(page.getByLabel('punch end').nth(2)).not.toBeEmpty()
  await expect(page.getByLabel('duration').nth(2)).toHaveValue('0s')
})
