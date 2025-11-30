import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckSwapRender, 'page'>

export type CheckSwapRender = () => Promise<void>

export const createCheckSwapRender: Wrapper = ({ page }) => (
  async () => {
    const input = await page.waitForSelector('[data-testid="amount-input"]')
    const isInputVisible = await input.isVisible()

    expect(isInputVisible).toEqual(true)
  }
)
