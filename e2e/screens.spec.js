// @ts-check
import { test, expect } from '@playwright/test'

/**
 * Block external font CDN requests to prevent test hangs in restricted network environments.
 * Google Fonts CSS blocks rendering and prevents module scripts from executing.
 */
test.beforeEach(async ({ page }) => {
  await page.route('**/*.googleapis.com/**', route => route.abort())
  await page.route('**/*.gstatic.com/**', route => route.abort())
})

test.describe('Screen navigation', () => {
  test('title screen displays correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('そろばんチャレンジ')
    await expect(page.locator('.subtitle')).toHaveText('補数パズルゲーム')
    await expect(page.locator('.difficulty-btn')).toHaveCount(5)
  })

  test('title screen → game screen transition', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')
    await expect(page.locator('.game-screen')).toBeVisible()
    await expect(page.locator('.problem-digit')).toHaveCount(3) // normal = 3 digits
  })

  test('game screen shows countdown overlay', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="easy"]')
    await expect(page.locator('.countdown-overlay')).toBeVisible()
  })

  test('game screen has abacus with correct rod count', async ({ page }) => {
    await page.goto('/')

    // easy = 2 digits
    await page.click('[data-difficulty="easy"]')
    await page.locator('.countdown-overlay').waitFor({ state: 'hidden', timeout: 3000 })
    const upperRods = page.locator('.abacus-upper .rod')
    await expect(upperRods).toHaveCount(2)
  })

  test('game screen → result screen transition', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')

    // Wait for auto-transition to result (mock: 6 seconds)
    await expect(page.locator('.result-screen')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.result-screen h2')).toHaveText('タイムアップ！')
  })

  test('result screen → title screen via button', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')
    await expect(page.locator('.result-screen')).toBeVisible({ timeout: 10000 })

    await page.click('#title-btn')
    await expect(page.locator('.title-screen')).toBeVisible()
  })

  test('result screen → retry game via button', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')
    await expect(page.locator('.result-screen')).toBeVisible({ timeout: 10000 })

    await page.click('#retry-btn')
    await expect(page.locator('.game-screen')).toBeVisible()
  })
})

test.describe('Difficulty selection', () => {
  const cases = [
    { difficulty: 'practice', digits: 2 },
    { difficulty: 'easy', digits: 2 },
    { difficulty: 'normal', digits: 3 },
    { difficulty: 'hard', digits: 4 },
    { difficulty: 'challenge', digits: 5 },
  ]

  for (const { difficulty, digits } of cases) {
    test(`${difficulty} mode creates ${digits}-digit problem`, async ({ page }) => {
      await page.goto('/')
      await page.click(`[data-difficulty="${difficulty}"]`)
      await expect(page.locator('.problem-digit')).toHaveCount(digits)
      await expect(page.locator('.abacus-upper .rod')).toHaveCount(digits)
    })
  }
})
