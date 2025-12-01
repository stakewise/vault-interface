type Wrapper = E2E.FixtureMethod<Submit, 'page' | 'transactions'>

export type Submit = () => Promise<void>

export const createSubmit: Wrapper = ({ page, transactions }) => (
  async () => {
    const submitButton = await page.waitForSelector('[data-testid="submit-button"]')
    await submitButton.waitForElementState('enabled')

    await page.getByTestId('submit-button').click()

    await transactions.checkTransaction({
      withBottomLoader: true,
    })
  }
)
