import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckBalances, 'page'>
type CheckBalancesInput = Partial<Record<Token, string>>
type Token = 'ETH' | 'osETH' | 'GNO' | 'osGNO' | 'xDAI' | 'SWISE'

export type CheckBalances = (balances: CheckBalancesInput) => Promise<void>

export const createCheckBalances: Wrapper = ({ page }) => (
  async (balances: CheckBalancesInput) => {
    const accountButton = page.getByTestId('account-button')

    await accountButton.click()

    for (const token in balances) {
      const balance = balances[token as keyof typeof balances]

      if (!balance) {
        return
      }

      const tokenAmountElement = await page.waitForSelector(`[data-testid="${token}-amount"]`, { timeout: 60_000 })
      const tokenAmount = await tokenAmountElement.textContent() || ''

      const [ amount, remainder ] = tokenAmount.split('.')
      const formattedAmount = amount.replace(/,/g, '')

      const diff = Number(balance) - Number(`${formattedAmount}.${remainder || 0}`)

      if (token === 'ETH') {
        // compare with amount minus gas
        expect(diff).toBeLessThanOrEqual(0.002)
      }
      else {
        // compare with rounded amount
        expect(diff).toBeLessThanOrEqual(0.0002)
      }
    }

    await accountButton.click()
  }
)
