import { formatEther, parseEther } from 'ethers'


type Wrapper = E2E.FixtureMethod<Mint, 'page'>

export type Mint = (values: Input) => Promise<string>

export type Input = {
  vaultAddress: string
  assets: string
}

export const createMint: Wrapper = ({ page }) => (
  async ({ vaultAddress, assets }: Input) => {
    const shares = await page.evaluate(async ({ vaultAddress, stakeAssets }) => {
      const sdk = window.e2e.sdk
      // @ts-ignore
      const userAddress = window.ethereum.signer.address

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
    })

    return formatEther(shares)
  }
)
