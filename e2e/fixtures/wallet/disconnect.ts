import * as constants from '../../constants'


type Wrapper = E2E.FixtureMethod<Disconnect, 'page' | 'helpers'>

type Input = {
  wallet: typeof constants.walletTitles[keyof typeof constants.walletTitles]
}

export type Disconnect = (values?: Input) => Promise<void>

export const createDisconnect: Wrapper = ({ page, helpers }) => (
  async (values?: Input) => {
    const { wallet = constants.walletTitles.metaMask } = values || {}

    await page.getByTestId('account-button').click()
    await page.getByTestId('disconnect-wallet-button').click()

    await helpers.checkNotification(`Successfully disconnected from ${wallet}`)
  }
)
