import { parseEther } from 'ethers'

import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockBoostData, 'page'>

type Input = {
  shares: string
  rewards?: string
  vaultApy?: string
  maxBoostApy?: string
  exitingPercent?: string
}

export type MockBoostData = (values: Input) => Promise<void>

export const createMockBoostData: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { shares, rewards, maxBoostApy, vaultApy, exitingPercent } = values

    await mockCustomDataOnce<any>({
      page,
      name: 'BoostMainData',
      data: {
        leverageStrategyPositions: [
          {
            proxy: '',
            borrowLtv: '0',
            exitingPercent: exitingPercent || '0',
            osTokenShares: parseEther(shares).toString(),
            boostRewardAssets: parseEther(rewards || '0').toString(),
          },
        ],
        vaults: [
          {
            osTokenConfig: {
              ltvPercent: '999900000000000000',
            },
            osTokenHolderMaxBoostApy: maxBoostApy || '0',
            allocatorMaxBoostApy: maxBoostApy || '0',
            apy: vaultApy || '0',
          },
        ],
        allocators: [
          {
            assets: (parseEther(shares) * 2n).toString(),
          },
        ],
      },
    })
  }
)
