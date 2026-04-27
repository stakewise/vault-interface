import { parseEther } from 'ethers'


type Input = {
  stakedAssets?: string
  mintedShares?: string
}

type Output = Store['vault']['user']['balances']['mintToken']

export type SetMintTokenData = (values: Input) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetMintTokenData, 'page'>

const LTV_PERCENT = 999900000000000000n
const PRECISION = 1000000000000000000n

export const createSetMintTokenData: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { stakedAssets = '0', mintedShares = '0' } = values

    const stakedAssetsBigInt = parseEther(stakedAssets)
    const mintedSharesBigInt = parseEther(mintedShares)

    const mintedAssets = mintedSharesBigInt
    const maxMintedAssets = stakedAssetsBigInt * LTV_PERCENT / PRECISION
    const maxMintShares = maxMintedAssets > mintedAssets ? maxMintedAssets - mintedAssets : 0n

    const payload = {
      mintedShares: mintedSharesBigInt.toString(),
      mintedAssets: mintedAssets.toString(),
      maxMintShares: maxMintShares.toString(),
      hasMintBalance: mintedSharesBigInt > 0n,
    }

    await page.addInitScript((data) => {
      const result = {
        mintedShares: BigInt(data.mintedShares),
        mintedAssets: BigInt(data.mintedAssets),
        maxMintShares: BigInt(data.maxMintShares),
        hasMintBalance: data.hasMintBalance,
        isDisabled: false,
      } satisfies Output

      window.e2e = {
        ...window.e2e,
        ['user/balances/setMintTokenData']: result,
      }
    }, payload)
  }
)
