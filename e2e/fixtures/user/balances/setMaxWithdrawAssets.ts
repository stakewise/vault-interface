import { parseEther } from 'ethers'


type Output = Store['vault']['user']['balances']['maxWithdrawAssets']

export type SetMaxWithdrawAssets = (asset: string) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetMaxWithdrawAssets, 'page'>

export const createSetMaxWithdrawAssets: Wrapper = ({ page }) => (
  async (asset: string) => {

    const data: Output = parseEther(asset)

    await page.evaluate((payload) => {
      window.e2e = {
        ...window.e2e,
        ['user/balances/setMaxWithdrawAssets']: payload,
      }
    }, data)
  }
)
