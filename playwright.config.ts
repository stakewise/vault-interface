import { devices, PlaywrightTestConfig } from '@playwright/test'
import dotenv from 'dotenv'


dotenv.config()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 90 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [ [ "html", { open: "never" } ] ],
  use: {
    ...devices['Desktop Chrome'],

    userAgent: "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    headless: true,
    actionTimeout: 5000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      size: { width: 640, height: 480 },
    },
    launchOptions: {
      args: [ '--disable-web-security' ],
    },
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
    },
  },
  projects: [
    {
      name: 'Tests',
      testMatch: /.*\.spec\.ts$/,
      use: {
        baseURL: process.env.URL || 'http://local.stakewise.io:5005',
      },
    },
  ],
  webServer: process.env.WITH_ANVIL
    ? [
      {
        command: './scripts/fork-ci.sh',
        url: 'http://localhost:8545',
      },
    ]
    : [],
}


export default config
