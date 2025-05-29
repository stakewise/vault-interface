import { parseEther } from 'ethers'


type Wrapper = E2E.FixtureMethod<MockPosition, 'graphql'>

type Input = {
  isClaimable?: boolean
}

type Output = {
  exitingShares: number
  exitingRewards: number
}

export type MockPosition = (values?: Input) => Promise<Output>

export const createMockPosition: Wrapper = ({ graphql }) => (
  async (values?: Input) => {
    const { isClaimable } = values || {}

    const isExiting = typeof isClaimable === 'boolean'

    const exitingShares = isExiting ? '10.5' : '0'
    const exitingRewards = isExiting ? '1.5' : '0'

    await graphql.mockPosition({
      exitingShares: parseEther(exitingShares).toString(),
      exitingRewards: parseEther(exitingRewards).toString(),
      isClaimable,
    })

    return {
      exitingShares: Number(exitingShares),
      exitingRewards: Number(exitingRewards),
    }
  }
)
