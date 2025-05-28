import * as constants from '../../constants'


type Wrapper = E2E.FixtureMethod<Connect, 'page' | 'helpers'>

export type Connect = () => Promise<void>

export const createConnect: Wrapper = ({ page, helpers }) => (
  async () => {
    await page.getByTestId('connect-button').click()
    await page.getByTestId('metaMask-connector-button').click()

    await helpers.checkNotification(`Successfully connected with ${constants.walletTitles.metaMask}`)
  }
)
