import { parseEther } from 'ethers'


type Wrapper = E2E.FixtureMethod<SetBalance, 'gui' | 'anvil' | 'graphql'>

export type Token = 'ETH' | 'osETH'

export type SetBalance = (amount: string, token: Token) => Promise<void>

const tokenAddresses = {
  'osETH': '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
}

export const createSetBalance: Wrapper = ({ gui, anvil, graphql }) => (
  async (amount: string, token: Token) => {
    const amountWei = parseEther(amount)

    if (token === 'ETH') {
      await gui.setEthBalance(amountWei)
    }
    else {
      const tokenAddress = tokenAddresses[token as keyof typeof tokenAddresses]

      const isAnvil = token !== 'osETH' || process.env.CI

      const promises = [
        isAnvil
          ? anvil.setBalance({
            amount: amountWei.toString(),
            tokenAddress,
          })
          : gui.setBalance(tokenAddress, amountWei),
      ]

      if (token === 'osETH') {
        promises.push(
          graphql.mockMintTokenBalance(amount)
        )
      }

      await Promise.all(promises)
    }
  }
)
