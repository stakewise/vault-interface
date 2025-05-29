import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckCurrency, 'page' | 'element' | 'helpers'>

export type CheckCurrency = () => Promise<void>

const currencyList = [ 'USD', 'EUR', 'GBP' ]

export const createCheckCurrency: Wrapper = ({ page, element, helpers }) => (
  async () => {
    for (const currency of currencyList) {
      await page.getByTestId('settings-toggle-button').click()
      await helpers.changeSelect('settings-currency', currency.toLowerCase())

      const localStorageCurrency = await helpers.getLocalStorageItem('SW_currency')
      expect(localStorageCurrency).toBe(currency)

      await page.reload()

      expect(localStorageCurrency).toBe(currency)
      await page.getByTestId('settings-toggle-button').click()
      await element.checkText({ testId: 'settings-currency-button-subtitle', expectedText: currency })

      await page.getByTestId('settings-toggle-button').click()
    }
  }
)
