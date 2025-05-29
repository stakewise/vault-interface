import { createInput } from './input'


type Wrapper = E2E.FixtureMethod<SubmitAmount, 'page'>

export type SubmitAmount = (amount?: string) => Promise<void>

export const createSubmitAmount: Wrapper = ({ page }) => (
  async (amount?: string) => {
    const input = createInput({ page })

    await input.fill(amount)

    const submitButton = await page.waitForSelector('[data-testid="submit-button"]')
    await submitButton.waitForElementState('enabled')

    await page.getByTestId('submit-button').click()
  }
)
