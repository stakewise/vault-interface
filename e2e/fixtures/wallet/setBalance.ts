import { parseEther } from 'ethers'

import { tokens } from './chains'
import type { SupportedNetwork } from './chains'
import type { Balance } from './helpers'
import type { SetEthBalance } from './setEthBalance'


export type Token = 'ETH' | 'osETH'

type Input = {
  token: Token
  amount: string
  chainId?: SupportedNetwork
}

export type SetBalance = (input: Input) => Promise<void>

const tokenAddresses: Partial<Record<Token, string>> = {
  osETH: tokens.mainnet.mintToken,
}

type Wrapper = (deps: {
  balance: Balance
  setEthBalance: SetEthBalance
  graphql: E2E.ExtendedTest['graphql']
}) => SetBalance

export const createSetBalance: Wrapper = ({ balance, setEthBalance, graphql }) => (
  async ({ token, amount, chainId }) => {
    const amountWei = parseEther(amount)

    if (token === 'ETH') {
      await setEthBalance({ amount: amountWei, chainId })

      return
    }

    const tokenAddress = tokenAddresses[token]

    if (!tokenAddress) {
      throw new Error(`setBalance: missing address mapping for token ${token}`)
    }

    const promises: Promise<void>[] = [ balance({ token: tokenAddress, amount: amountWei, chainId }) ]

    if (token === 'osETH') {
      promises.push(graphql.mockMintTokenBalance(amount))
    }

    await Promise.all(promises)
  }
)
