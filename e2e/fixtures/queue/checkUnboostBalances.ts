import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckUnboostBalances, 'page' | 'element'>

type Input = {
  exitingShares: number
  exitingRewards: number
  isClaimable?: boolean
}

export type CheckUnboostBalances = (values: Input) => Promise<void>

export const createCheckUnboostBalances: Wrapper = ({ page, element }) => (
  async (values: Input) => {
    const { exitingShares, exitingRewards, isClaimable } = values

    await page.getByTestId('unboost-queue-toggle').click()

    const [
      exitingSharesAmount,
      exitingRewardsAmount,
    ] = await Promise.all([
      page.getByTestId('exiting-shares-amount').textContent(),
      page.getByTestId('exiting-rewards-amount').textContent(),
    ])

    expect(Number(exitingSharesAmount)).toEqual(exitingShares)
    expect(Number(exitingRewardsAmount)).toEqual(exitingRewards)

    const claimButton = page.getByTestId('unboost-queue-claim-button')

    if (isClaimable) {
      await expect(claimButton).not.toBeDisabled()
    }
    else {
      await expect(claimButton).toBeDisabled()
    }

    await element.checkVisibility({
      testId: 'unboost-queue-duration',
      isVisible: !isClaimable,
    })
  }
)
