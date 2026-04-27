import { parseEther } from 'ethers'
import * as constants from '../../../constants'


export type SetStakeBalance = (amount: string) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetStakeBalance, 'page'>

export const createSetStakeBalance: Wrapper = ({ page }) => (
  async (amount: string) => {
    const assets = Number(amount) ? parseEther(amount) : 0n
    const stakedAssets = assets > constants.minimalAmount ? assets : 0n

    const payload = {
      stakedAssets: stakedAssets.toString(),
      totalEarnedAssets: parseEther('220').toString(),
      totalBoostEarnedAssets: parseEther('190').toString(),
      totalStakeEarnedAssets: parseEther('100').toString(),
    }

    await page.addInitScript((data) => {
      window.e2e = {
        ...window.e2e,
        ['user/balances/setStakeBalance']: {
          stakedAssets: BigInt(data.stakedAssets),
          totalEarnedAssets: BigInt(data.totalEarnedAssets),
          totalBoostEarnedAssets: BigInt(data.totalBoostEarnedAssets),
          totalStakeEarnedAssets: BigInt(data.totalStakeEarnedAssets),
        },
      }
    }, payload)
  }
)
