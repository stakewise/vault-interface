import { formatEther, parseEther } from 'ethers'


type Wrapper = E2E.FixtureMethod<Mint, 'page' | 'wallet'>

export type Mint = (values: Input) => Promise<string>

export type Input = {
  vaultAddress: string
  assets: string
}

export const createMint: Wrapper = ({ page, wallet }) => (
  async ({ vaultAddress, assets }: Input) => {
    const shares = await page.evaluate(async ({ vaultAddress, stakeAssets, userAddress }) => {
      const sdk = window.e2e.sdk

      const assets = BigInt(stakeAssets)
      const shares = await sdk.contracts.base.mintTokenController.convertToShares(assets)

      const mintHash = await sdk.osToken.mint({
        vaultAddress,
        userAddress,
        shares,
      })

      await sdk.provider.waitForTransaction(mintHash)

      return shares.toString()
    }, {
      vaultAddress,
      stakeAssets: parseEther(assets).toString(),
      userAddress: wallet.getAddress(),
    })

    return formatEther(shares)
  }
)
