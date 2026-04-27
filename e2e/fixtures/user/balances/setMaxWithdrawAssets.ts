import { parseEther } from 'ethers'


export type SetMaxWithdrawAssets = (asset: string) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetMaxWithdrawAssets, 'page'>

export const createSetMaxWithdrawAssets: Wrapper = ({ page }) => (
  async (asset: string) => {
    const value = parseEther(asset).toString()

    await page.addInitScript((payload) => {
      window.e2e = {
        ...window.e2e,
        ['user/balances/setMaxWithdrawAssets']: BigInt(payload),
      }
    }, value)
  }
)
