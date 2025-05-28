import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockMintTokenApy, 'page'>

export type MockMintTokenApy = (apy: string) => Promise<void>

export const createMockMintTokenApy: Wrapper = ({ page }) => (
  async (apy: string) => {
    await mockCustomDataOnce<any>({
      page,
      name: 'osTokenApy',
      data: {
        osTokens: [ { apy, feePercent: 1 } ],
      },
    })
  }
)
