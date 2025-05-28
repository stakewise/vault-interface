import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckLink, 'page'>

type Input = {
  testId: string
  isPopup?: boolean
  isMobile?: boolean
  expectedURL: string | RegExp
  skipPageHeadingCheck?: boolean
}

export type CheckLink = (values: Input) => Promise<void>

export const createCheckLink: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { expectedURL, testId, isPopup = false, skipPageHeadingCheck } = values

    if (isPopup) {
      const [ newPage ] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByTestId(testId).click(),
      ])

      await expect(newPage).toHaveURL(expectedURL)
      await newPage.close()
    }
    else {
      await page.getByTestId(testId).click()
      await page.waitForURL(expectedURL, { timeout: 60_000 })

      await expect(page).toHaveURL(expectedURL)

      if (!skipPageHeadingCheck) {
        await page.waitForLoadState('networkidle')
        await expect(page.getByTestId('page-heading')).toBeVisible()
      }
    }
  }
)
