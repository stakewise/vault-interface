import { mockCustomDataOnce } from './helpers'
import { createMockBoostData } from './mockBoostData'


type Wrapper = E2E.FixtureMethod<MockPosition, 'page'>

type Input = {
  exitingShares: string
  exitingRewards: string
  isClaimable?: boolean
}

export type MockPosition = (values: Input) => Promise<void>

export const createMockPosition: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { exitingShares, exitingRewards, isClaimable } = values

    const isExiting = typeof isClaimable === 'boolean'

    const exitingPosition = {
      isClaimable: isClaimable as boolean,
      timestamp: '1730206212',
      totalAssets: '5716409381998981494',
      exitedAssets: '5716409381998981494',
      positionTicket: '210258902756807306422',
      exitQueueIndex: isClaimable ? '1' : null,
      withdrawalTimestamp: isClaimable ? '0' : '210258902756807306422',
    }

    const mockBoostData = createMockBoostData({ page })

    await Promise.all([
      mockCustomDataOnce<any>({
        page,
        name: 'BoostQueuePositions',
        data: {
          leverageStrategyPositions: [
            {
              exitingPercent: '100',
              exitingAssets: exitingRewards,
              exitingOsTokenShares: exitingShares,
              exitRequest: isExiting ? exitingPosition : null,
            },
          ],
        },
      }),
      mockBoostData({
        shares: '0',
        exitingPercent: '100',
      }),
    ])
  }
)
