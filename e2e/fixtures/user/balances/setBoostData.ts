import { parseEther, formatEther } from 'ethers'


type Input = {
  shares: string
  rewards?: string
  vaultApy?: number
  maxBoostApy?: number
  exitingPercent?: number
  leverageStrategyData?: {
    version?: number,
    isUpgradeRequired?: boolean,
  },
}

type Output = {
  totalShares: string
  rewardShares: string
}

type Payload = Store['vault']['user']['balances']['boost']

export type SetBoostData = (values: Input) => Promise<Output>

type Wrapper = E2E.FixtureMethod<SetBoostData, 'page'>

export const createSetBoostData: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { shares, rewards = '0', vaultApy = 0, maxBoostApy = 0, exitingPercent = 0, leverageStrategyData } = values

    const leverageStrategyVersion = leverageStrategyData?.version || 1
    const isUpgradeRequired = leverageStrategyVersion === 1 && exitingPercent === 0

    const data = {
      exitingPercent,
      borrowedAssets: 0n,
      shares: parseEther(shares),
      vaultApy: Number(vaultApy),
      allocatorMaxBoostApy: maxBoostApy,
      rewardAssets: parseEther(rewards),
      borrowStatus: 0,
      leverageStrategyData: {
        version: leverageStrategyVersion,
        isUpgradeRequired: leverageStrategyData?.isUpgradeRequired || isUpgradeRequired,
      },
    }

    const result = await page.evaluate(async (payload) => {
      const sdk = window.e2e.sdk

      const rewardShares =  await sdk.contracts.base.mintTokenController.convertToShares(payload.rewardAssets)
      const totalShares = payload.shares + rewardShares

      const mockResult: Payload = {
        ...payload,
        totalShares,
      }

      window.e2e = {
        ...window.e2e,
        ['user/balances/setBoostData']: mockResult,
      }

      return {
        totalShares,
        rewardShares,
      }
    }, data)

    return {
      totalShares: formatEther(result.totalShares),
      rewardShares: formatEther(result.rewardShares),
    }
  }
)
