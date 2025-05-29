import { parseEther } from 'ethers'

import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockMintTokenBalance, 'page'>

export type MockMintTokenBalance = (balance: string) => Promise<void>

export const createMockMintTokenBalance: Wrapper = ({ page }) => (
  async (balance: string) => {
    await mockCustomDataOnce<any>({
      page,
      name: 'MintTokenBalance',
      data: {
        osTokenHolders: [
          {
            balance: parseEther(balance).toString(),
          },
        ],
      },
    })
  }
)
