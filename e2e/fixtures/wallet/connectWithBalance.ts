import * as constants from '../../constants'

import { createSetBalance, Token } from './setBalance'


type Wrapper = E2E.FixtureMethod<ConnectWithBalance, 'page' | 'helpers' | 'gui' | 'anvil' | 'graphql'>

type Input = Partial<Record<Token, string>>

export type ConnectWithBalance = (tokens: Input) => Promise<void>

export const createConnectWithBalance: Wrapper = ({ page, helpers, gui, anvil, graphql }) => (
  async (tokens: Input) => {
    const promises: Promise<void>[] = []

    const setBalance = createSetBalance({ gui, anvil, graphql })

    Object.keys(tokens).forEach((token) => {
      const amount = tokens[token as Token]

      if (amount) {
        promises.push(
          setBalance(amount, token as Token)
        )
      }
    })

    await Promise.all(promises)

    await page.getByTestId('connect-button').click()
    await page.getByTestId('metaMask-connector-button').click()

    await helpers.checkNotification(`Successfully connected with ${constants.walletTitles.metaMask}`)
  }
)
