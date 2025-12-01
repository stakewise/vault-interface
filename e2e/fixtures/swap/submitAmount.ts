type Wrapper = E2E.FixtureMethod<SubmitAmount, 'page'>

export type SubmitAmount = () => Promise<void>

export const createSubmitAmount: Wrapper = ({ page }) => (
  async () => {
    const submitButton = await page.waitForSelector('[data-testid="submit-button"]')
    await submitButton.waitForElementState('enabled')

    await page.getByTestId('submit-button').click()
  }
)
