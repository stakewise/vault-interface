import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckText, 'page'>

type Input = {
  testId: string
  expectedText?: string | RegExp
}

export type CheckText = (values: Input) => Promise<void>

export const createCheckText: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { testId, expectedText = /.+/ } = values

    const textContent = await page.getByTestId(testId).textContent()

    expect(textContent).toMatch(expectedText)
  }
)
