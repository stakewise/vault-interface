import { parseEther } from 'ethers'
import * as constants from '../../../constants'


type Output = Pick<Store['vault']['user']['balances'],
  'stakedAssets'
  | 'totalEarnedAssets'
  | 'totalStakeEarnedAssets'
  | 'totalBoostEarnedAssets'
>

export type SetStakeBalance = (amount: string) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetStakeBalance, 'page'>

export const createSetStakeBalance: Wrapper = ({ page }) => (
  async (amount: string) => {
    const assets = Number(amount) ? parseEther(amount) : 0n

    const data: Output = {
      totalEarnedAssets: parseEther('220'),
      totalBoostEarnedAssets: parseEther('190'),
      totalStakeEarnedAssets: parseEther('100'),
      stakedAssets: assets > constants.minimalAmount ? assets : 0n,
    }

    await page.evaluate((payload) => {
      window.e2e = {
        ...window.e2e,
        ['user/balances/setStakeBalance']: payload,
      }
    }, data)
  }
)
