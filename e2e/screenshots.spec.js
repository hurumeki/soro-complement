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
test.describe('Visual regression', () => {
  test('title screen', async ({ page }) => {
    await page.goto('/')
    // Wait for web font to load
    await page.waitForFunction(() => document.fonts.ready)
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('title-screen.png', {
      fullPage: true,
    })
  })

  test('game screen', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')
    // Wait for countdown to disappear
    await page.locator('.countdown-overlay').waitFor({ state: 'hidden', timeout: 3000 })
    await expect(page).toHaveScreenshot('game-screen.png', {
      fullPage: true,
      // Problem digits are random, so mask them
      mask: [page.locator('.problem-digits')],
    })
  })

  test('result screen', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-difficulty="normal"]')
    await expect(page.locator('.result-screen')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveScreenshot('result-screen.png', {
      fullPage: true,
    })
  })
})
