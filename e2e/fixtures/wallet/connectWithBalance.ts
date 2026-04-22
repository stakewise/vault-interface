import * as constants from '../../constants'

import type { SetBalance, Token } from './setBalance'


type Input = Partial<Record<Token, string>>

export type ConnectWithBalance = (tokens: Input) => Promise<void>

type Deps = {
  page: E2E.ExtendedTest['page']
  helpers: E2E.ExtendedTest['helpers']
  setBalance: SetBalance
}

export const createConnectWithBalance = ({ page, helpers, setBalance }: Deps): ConnectWithBalance => (
  async (tokens) => {
    const entries = Object.entries(tokens) as [Token, string | undefined][]

    await Promise.all(
      entries
        .filter(([ , amount ]) => Boolean(amount))
        .map(([ token, amount ]) => setBalance({ token, amount: amount! }))
    )

    await page.getByTestId('connect-button').click()
    await page.getByTestId('metaMask-connector-button').click()

    await helpers.checkNotification(`Successfully connected with ${constants.walletTitles.metaMask}`)
  }
)
