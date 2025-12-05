import { createMockCustomData, MockCustomData } from './mockCustomData'
import { createMockTransaction, MockTransaction } from './mockTransaction'
import { createWaitForResponse, WaitForResponse } from './waitForResponse'
import { createMockAllocatorsData, MockAllocatorsData } from './mockAllocatorsData'
import { createMockCustomDataOnce, MockCustomDataOnce } from './mockCustomDataOnce'
import { createMockMintTokenBalance, MockMintTokenBalance } from './mockMintTokenBalance'


export type GraphqlFixture = {
  mockCustomData: MockCustomData
  mockTransaction: MockTransaction
  waitForResponse: WaitForResponse
  mockAllocatorsData: MockAllocatorsData
  mockCustomDataOnce: MockCustomDataOnce
  mockMintTokenBalance: MockMintTokenBalance
}

const graphql: E2E.Fixture<GraphqlFixture> = async ({ page }, use) => {
  await use({
    mockCustomData: createMockCustomData({ page }),
    waitForResponse: createWaitForResponse({ page }),
    mockTransaction: createMockTransaction({ page }),
    mockCustomDataOnce: createMockCustomDataOnce({ page }),
    mockAllocatorsData: createMockAllocatorsData({ page }),
    mockMintTokenBalance: createMockMintTokenBalance({ page }),
  })
}


export default graphql
