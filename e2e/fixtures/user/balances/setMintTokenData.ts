import { parseEther } from 'ethers'


type Input = {
  stakedAssets?: string
  mintedShares?: string
}

type Output = Store['vault']['user']['balances']['mintToken']

export type SetMintTokenData = (values: Input) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetMintTokenData, 'page'>

export const createSetMintTokenData: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { stakedAssets = '0', mintedShares = '0' } = values

    const data = {
      stakedAssets: parseEther(stakedAssets),
      mintedShares: parseEther(mintedShares),
    }

    await page.evaluate(async (payload) => {
      const sdk = window.e2e.sdk

      const avgRewardPerSecond = await sdk.contracts.base.mintTokenController.avgRewardPerSecond()
      const ltvPercent = 999900000000000000n

      const maxMintedAssets = payload.stakedAssets * ltvPercent / 1000000000000000000n
      const maxMintedAssetsHourReward = (maxMintedAssets * avgRewardPerSecond * 3600n) / 1000000000000000000n
      const mintedAssets = await sdk.contracts.base.mintTokenController.convertToAssets(payload.mintedShares)

      const canMintAssets = maxMintedAssets - maxMintedAssetsHourReward - mintedAssets

      let maxMintShares = 0n

      if (canMintAssets > 0) {
        maxMintShares = await sdk.contracts.base.mintTokenController.convertToShares(canMintAssets)
      }

      const result: Output = {
        ...payload,
        mintedAssets,
        maxMintShares,
        isDisabled: false,
        hasMintBalance: true,
        mintedShares: payload.mintedShares,
      }

      window.e2e = {
        ...window.e2e,
        ['user/balances/setMintTokenData']: result,
      }
    }, data)
  }
)
