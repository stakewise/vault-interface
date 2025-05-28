import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckVisibility, 'page'>

type Input = {
  testId: string
  isVisible?: boolean
}

export type CheckVisibility = (values: Input) => Promise<void>

export const createCheckVisibility: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { testId, isVisible = true } = values

    const selector = `[data-testid="${testId}"]`

    if (isVisible) {
      await page.waitForSelector(selector, { state: 'visible' })
      expect(await page.isVisible(selector)).toBe(true)
    }
    else {
      await page.waitForSelector(selector, { state: 'hidden' })
      expect(await page.isVisible(selector)).toBe(false)
    }
  }
)
