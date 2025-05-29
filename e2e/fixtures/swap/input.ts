type Wrapper = E2E.FixtureMethod<Input, 'page'>

export type Input = {
  fill: (amount?: string) => Promise<void>
  value: () => Promise<string>
  token: () => Promise<string>
}

export const createInput: Wrapper = ({ page }) => {
  const fill = async (amount?: string) => {
    const input = await page.waitForSelector('[data-testid="amount-input"]')

    if (amount) {
      await input.fill(amount)
    }
    else {
      await page.getByTestId('max-button').click()
    }
  }

  const value = async () => {
    const input = await page.waitForSelector('[data-testid="amount-input"]')
    const value = await input.inputValue()

    return value
  }

  const token = async () => {
    const token = await page.getByTestId('amount-input-token').textContent()

    return token || ''
  }

  return {
    fill,
    value,
    token,
  }
}
