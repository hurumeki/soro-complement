import { defineConfig, devices } from '@playwright/test'

/**
 * Use a custom Chromium executable if PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH is set.
 * This is useful in environments where `npx playwright install` cannot download browsers.
 */
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'e2e/report', open: 'never' }],
    ['list'],
  ],

  /* Screenshot comparison settings */
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  /* Shared settings for all projects */
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...(chromiumExecutable && {
      launchOptions: {
        executablePath: chromiumExecutable,
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
      },
    }),
  },

  /* Mobile-first: test on smartphone viewports */
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
  ],

  /* Build and serve static files before tests */
  webServer: {
    command: 'npm run build && npx serve dist -l 4173 -s --cors',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
