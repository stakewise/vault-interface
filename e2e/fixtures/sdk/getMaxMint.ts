import { formatEther, parseEther } from 'ethers'


type Wrapper = E2E.FixtureMethod<GetMaxMint, 'page'>

export type GetMaxMint = (values: Input) => Promise<string>

export type Input = {
  ltvPercent: string
  mintedAssets: string
  stakedAssets: string
  vaultAddress: string
}

export const createGetMaxMint: Wrapper = ({ page }) => (
  async (values: Input) => {
    const shares = await page.evaluate(async (values) => {
      const { mintedAssets, ltvPercent, stakedAssets, vaultAddress } = values

      const sdk = window.e2e.sdk
      // @ts-ignore
      const userAddress = window.ethereum.signer.address

      const shares = await sdk.osToken.getMaxMint({
        userAddress,
        vaultAddress,
        ltvPercent: BigInt(ltvPercent),
        stakedAssets: BigInt(stakedAssets),
        mintedAssets: BigInt(mintedAssets),
      })

      return shares.toString()
    }, {
      ...values,
      mintedAssets: parseEther(values.mintedAssets).toString(),
      stakedAssets: parseEther(values.stakedAssets).toString(),
    })

    return formatEther(shares)
  }
)
