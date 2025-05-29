import { parseEther } from 'ethers'

import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockExitQueue, 'page'>

type Input = {
  isClaimable?: boolean
}

type Output = {
  totalAssets: number
  exitedAssets: number
}

export type MockExitQueue = (values: Input) => Promise<Output>

export const createMockExitQueue: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { isClaimable } = values

    const totalAssets = '9.5'
    const exitedAssets = '1.5'

    await mockCustomDataOnce<any>({
      page,
      name: 'exitQueue',
      data: {
        exitRequests: [
          {
            exitQueueIndex: '0',
            timestamp: '1727256912',
            withdrawalTimestamp: '0',
            isClaimed: !isClaimable,
            isClaimable: Boolean(isClaimable),
            positionTicket: '156652794390067408267',
            totalAssets: parseEther(totalAssets).toString(),
            exitedAssets: parseEther(exitedAssets).toString(),
          },
        ],
      },
    })

    return {
      totalAssets: Number(totalAssets),
      exitedAssets: Number(exitedAssets),
    }
  }
)
