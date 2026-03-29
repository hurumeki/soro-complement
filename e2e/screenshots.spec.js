// @ts-check
import { test, expect } from '@playwright/test'

/**
 * Visual regression tests using Playwright's built-in screenshot comparison.
 *
 * First run:  generates baseline screenshots in e2e/screenshots.spec.js-snapshots/
 * Later runs: compares current screenshots against baselines.
 *
 * To update baselines: npx playwright test --update-snapshots
 */
/**
 * Block external font CDN to prevent rendering-blocking hangs in restricted environments.
 */
test.beforeEach(async ({ page }) => {
  await page.route('**/*.googleapis.com/**', route => route.abort())
  await page.route('**/*.gstatic.com/**', route => route.abort())
})

test.describe('Visual regression', () => {
  test('title screen', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('title-screen.png', {
      fullPage: true,
    })
  })

  test('game screen', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')
    // Wait for countdown to disappear
    await page.locator('.countdown-overlay').waitFor({ state: 'hidden', timeout: 5000 })
    await expect(page).toHaveScreenshot('game-screen.png', {
      fullPage: true,
      // Problem digits are random, so mask them; timer is dynamic so mask it too
      mask: [page.locator('.problem-digits'), page.locator('.timer-text')],
    })
  })

  test('result screen', async ({ page }) => {
    await page.addInitScript(() => { window.__testMode = true })
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')
    await expect(page.locator('.result-screen')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveScreenshot('result-screen.png', {
      fullPage: true,
      // Score is dynamic
      mask: [page.locator('.result-score .value'), page.locator('.high-score')],
    })
  })
})
