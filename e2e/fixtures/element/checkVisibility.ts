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
    const state = isVisible ? 'visible' : 'hidden'

    await page.waitForSelector(selector, { state })
  }
)
