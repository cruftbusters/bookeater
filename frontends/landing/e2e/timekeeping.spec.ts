import { expect, test } from '@playwright/test'

test.describe('v2', () => {
  test('start with punch in', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'punch in' }).click()
  })
  test('start with empty entry', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', { name: 'add empty entry' }).click()
  })
})

test.describe('v1', () => {
  test('manual timekeeping', async ({ page }) => {
    await page.goto('http://localhost:5173/v1')

    await page.getByRole('button', { name: 'add new entry' }).click()

    await page.getByLabel('punch start').nth(0).fill('2024-01-01 08:00:00')
    await page.getByLabel('punch end').nth(0).fill('2024-01-01 12:00:00')
    await expect(page.getByLabel('duration').nth(0)).toHaveValue('4h')

    await page.getByRole('button', { name: 'add new entry' }).click()

    await page.getByLabel('punch start').nth(1).fill('2024-01-01 12:30:00')
    await page.getByLabel('punch end').nth(1).fill('2024-01-01 16:15:00')
    await expect(page.getByLabel('duration').nth(1)).toHaveValue('3h45m')

    await page.getByRole('button', { name: 'delete entry' }).nth(0).click()
    await page.getByRole('button', { name: 'delete entry' }).click()

    await page.getByRole('button', { name: 'add new entry' }).click()

    await page.getByLabel('punch start').fill('2024-01-01 12:45:00')
    await page.getByLabel('punch end').fill('2024-01-01 18:45:00')

    await page.getByRole('button', { name: 'add new entry' }).click()

    await page.getByLabel('punch start').nth(1).fill('2024-01-01 19:00:00')
    await page.getByLabel('punch end').nth(1).fill('2024-01-01 21:00:00')

    await expect(page.getByLabel('duration').nth(0)).toHaveValue('6h')
    await expect(page.getByLabel('duration').nth(1)).toHaveValue('2h')

    await page.getByRole('button', { name: 'delete entry' }).nth(1).click()
    await page.getByRole('button', { name: 'delete entry' }).click()

    await expect(page.getByLabel('duration')).not.toBeVisible()
  })

  test('punch-button timekeeping', async ({ page }) => {
    await page.goto('http://localhost:5173/v1')

    await page.getByRole('button', { name: 'punch in' }).click()
    await page.getByRole('button', { name: 'punch out' }).click()

    await expect(page.getByLabel('punch start')).not.toBeEmpty()
    await expect(page.getByLabel('punch end')).not.toBeEmpty()
    await expect(page.getByLabel('duration')).toHaveValue(/[0-9]s/)
  })

  test('persist timekeeping entries', async ({ page }) => {
    await page.goto('http://localhost:5173/v1')

    await page.getByRole('button', { name: 'add new entry' }).click()

    await page.getByLabel('punch start').fill('2024-01-01 08:00:00')
    await page.getByLabel('punch end').fill('2024-01-01 12:00:00')

    await page.getByRole('button', { name: 'add new entry' }).click()

    await page.reload()

    await expect(page.getByLabel('duration').nth(0)).toHaveValue('4h')
    await expect(page.getByLabel('duration').nth(1)).toHaveValue('NaN')
  })
})
