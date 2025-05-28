import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<MonitorAddress, 'page'>

export type MonitorAddress = (address: string) => Promise<void>

export const createMonitorAddress: Wrapper = ({ page }) => (
  async (address: string) => {
    await page.getByTestId('connect-button').click()
    await page.getByTestId('monitorAddress-connector-button').click()
    await page.getByTestId('check-wallet-input').fill(address)
    await page.getByTestId('check-wallet-button').click()

    await expect(page.getByTestId('account-button')).toBeVisible()
  }
)
