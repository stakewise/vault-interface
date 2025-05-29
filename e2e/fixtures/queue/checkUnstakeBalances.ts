import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckUnstakeBalances, 'page'>

type Input = {
  totalAssets: number
  exitedAssets: number
  isClaimable?: boolean
}

export type CheckUnstakeBalances = (values: Input) => Promise<void>

export const createCheckUnstakeBalances: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { totalAssets, exitedAssets, isClaimable } = values

    await page.getByTestId('unstake-queue-toggle').click()

    const [
      totalAssetsAmount,
      exitedAssetsAmount,
    ] = await Promise.all([
      page.getByTestId('total-assets-amount').textContent(),
      page.getByTestId('exited-assets-amount').textContent(),
    ])

    const totalAmount = isClaimable ? totalAssets - exitedAssets : totalAssets
    const exitedAmount = isClaimable ? Number(exitedAssetsAmount) : 0

    expect(Number(totalAssetsAmount)).toEqual(totalAmount)
    expect(Number(exitedAssetsAmount)).toEqual(exitedAmount)

    const claimButton = page.getByTestId('unstake-queue-claim-button')

    if (isClaimable) {
      await expect(claimButton).not.toBeDisabled()
    }
    else {
      await expect(claimButton).toBeDisabled()
    }
  }
)
