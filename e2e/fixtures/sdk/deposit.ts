import { parseEther } from 'ethers'


type Wrapper = E2E.FixtureMethod<Deposit, 'page' | 'wallet'>

export type Deposit = (values: Input) => Promise<void>

export type Input = {
  vaultAddress: string
  assets: string
}

// Pull the address from the wallet fixture rather than reading
// `window.ethereum.signer.address` in-page - keeps the SDK call typed and
// removes a compat-shim dependency from the browser evaluate body.
export const createDeposit: Wrapper = ({ page, wallet }) => (
  async ({ vaultAddress, assets }: Input) => (
    page.evaluate(async ({ vaultAddress, depositAssets, userAddress }) => {
      const sdk = window.e2e.sdk
      const assets = BigInt(depositAssets)

      const depositHash = await sdk.vault.deposit({
        vaultAddress,
        userAddress,
        assets,
      })

      const receipt = await sdk.provider.waitForTransaction(depositHash)

      if (!receipt || receipt.status !== 1) {
        throw new Error(`deposit reverted: tx=${depositHash} status=${receipt?.status ?? 'no-receipt'}`)
      }
    }, {
      vaultAddress,
      depositAssets: parseEther(assets).toString(),
      userAddress: wallet.getAddress(),
    })
  )
)
