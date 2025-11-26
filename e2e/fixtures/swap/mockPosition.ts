type Wrapper = E2E.FixtureMethod<MockPosition, 'user'>

type Input = {
  isClaimable: boolean
}

type Output = {
  exitingShares: number
  exitingRewards: number
}

export type MockPosition = (values: Input) => Promise<Output>

export const createMockPosition: Wrapper = ({ user }) => (
  async (values: Input) => {
    const { isClaimable } = values

    const exitingShares = '10.5'
    const exitingRewards = '1.5'

    await user.setUnboostQueue({
      isClaimable,
      exitingShares,
      exitingRewards,
    })

    await user.balances.setBoostData({ shares: '0', exitingPercent: 100 })

    return {
      exitingShares: Number(exitingShares),
      exitingRewards: Number(exitingRewards),
    }
  }
)
