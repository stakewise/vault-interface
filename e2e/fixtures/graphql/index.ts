import { createMockUserApy, MockUserApy } from './mockUserApy'
import { createMockSwapApy, MockSwapApy } from './mockSwapApy'
import { createMockPosition, MockPosition } from './mockPosition'
import { createMockBoostData, MockBoostData } from './mockBoostData'
import { createMockExitQueue, MockExitQueue } from './mockExitQueue'
import { createMockSwapStats, MockSwapStats } from './mockSwapStats'
import { createMockVaultData, MockVaultData } from './mockVaultData'
import { createMockCustomData, MockCustomData } from './mockCustomData'
import { createMockStakeStats, MockStakeStats } from './mockStakeStats'
import { createMockTransaction, MockTransaction } from './mockTransaction'
import { createMockUserRewards, MockUserRewards } from './mockUserRewards'
import { createWaitForResponse, WaitForResponse } from './waitForResponse'
import { createMockMintTokenApy, MockMintTokenApy } from './mockMintTokenApy'
import { createMockAllocatorsData, MockAllocatorsData } from './mockAllocatorsData'
import { createMockCustomDataOnce, MockCustomDataOnce } from './mockCustomDataOnce'
import { createMockMintTokenBalance, MockMintTokenBalance } from './mockMintTokenBalance'


export type GraphqlFixture = {
  mockUserApy: MockUserApy
  mockSwapApy: MockSwapApy
  mockPosition: MockPosition
  mockVaultData:MockVaultData
  mockBoostData: MockBoostData
  mockExitQueue: MockExitQueue
  mockSwapStats: MockSwapStats
  mockStakeStats: MockStakeStats
  mockCustomData: MockCustomData
  mockTransaction: MockTransaction
  mockUserRewards: MockUserRewards
  waitForResponse: WaitForResponse
  mockMintTokenApy: MockMintTokenApy
  mockAllocatorsData: MockAllocatorsData
  mockCustomDataOnce: MockCustomDataOnce
  mockMintTokenBalance: MockMintTokenBalance
}

const graphql: E2E.Fixture<GraphqlFixture> = async ({ page }, use) => {
  await use({
    mockUserApy: createMockUserApy({ page }),
    mockSwapApy: createMockSwapApy({ page }),
    mockPosition: createMockPosition({ page }),
    mockVaultData: createMockVaultData({ page }),
    mockExitQueue: createMockExitQueue({ page }),
    mockSwapStats: createMockSwapStats({ page }),
    mockBoostData: createMockBoostData({ page }),
    mockStakeStats: createMockStakeStats({ page }),
    mockCustomData: createMockCustomData({ page }),
    waitForResponse: createWaitForResponse({ page }),
    mockTransaction: createMockTransaction({ page }),
    mockUserRewards: createMockUserRewards({ page }),
    mockMintTokenApy: createMockMintTokenApy({ page }),
    mockCustomDataOnce: createMockCustomDataOnce({ page }),
    mockAllocatorsData: createMockAllocatorsData({ page }),
    mockMintTokenBalance: createMockMintTokenBalance({ page }),
  })
}


export default graphql
