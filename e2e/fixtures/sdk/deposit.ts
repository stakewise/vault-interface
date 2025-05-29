import { parseEther } from 'ethers'


type Wrapper = E2E.FixtureMethod<Deposit, 'page'>

export type Deposit = (values: Input) => Promise<void>

export type Input = {
  vaultAddress: string
  assets: string
}

export const createDeposit: Wrapper = ({ page }) => (
  async ({ vaultAddress, assets }: Input) => (
    page.evaluate(async ({ vaultAddress, depositAssets }) => {
      const sdk = window.e2e.sdk
      // @ts-ignore
      const userAddress = window.ethereum.signer.address
      const assets = BigInt(depositAssets)

      const depositHash = await sdk.vault.deposit({
        vaultAddress,
        userAddress,
        assets,
      })

      await sdk.provider.waitForTransaction(depositHash)
    }, {
      vaultAddress,
      depositAssets: parseEther(assets).toString(),
    })
  )
)
