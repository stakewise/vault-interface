import { createMockEstimateGas, MockEstimateGas } from './mockEstimateGas'


export type ApiFixture = {
  mockEstimateGas: MockEstimateGas
}

const api: E2E.Fixture<ApiFixture> = async ({ page }, use) => {
  await use({
    mockEstimateGas: createMockEstimateGas({ page }),
  })
}


export default api
