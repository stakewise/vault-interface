import { createInput } from './input'


type Wrapper = E2E.FixtureMethod<Submit, 'page' | 'transactions'>

export type Submit = (amount?: string) => Promise<void>

export const createSubmit: Wrapper = ({ page, transactions }) => (
  async (amount?: string) => {
    const input = createInput({ page })

    await input.fill(amount)

    const submitButton = await page.waitForSelector('[data-testid="submit-button"]')
    await submitButton.waitForElementState('enabled')

    await page.getByTestId('submit-button').click()

    await transactions.checkTransaction({
      withBottomLoader: true,
    })
  }
)
