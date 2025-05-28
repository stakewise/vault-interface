import { allocatorMock, mockCustomData } from './helpers'


type Wrapper = E2E.FixtureMethod<MockStakeStats, 'page'>

export type MockStakeStats = () => Promise<void>

export const createMockStakeStats: Wrapper = ({ page }) => (
  async () => {
    await mockCustomData<any>({
      page,
      name: 'StakeStats',
      data: {
        osTokenHolder: allocatorMock,
      },
    })
  }
)
