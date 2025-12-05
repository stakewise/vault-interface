import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckConnectButton, 'page'>

export type CheckConnectButton = () => Promise<void>

export const createCheckConnectButton: Wrapper = ({ page }) => (
  async () => {
    await page.getByTestId('stake-connect-button').click()
    const modal = await page.getByTestId('metaMask-connector-button').isVisible()

    expect(modal).toBeTruthy()
  }
)
