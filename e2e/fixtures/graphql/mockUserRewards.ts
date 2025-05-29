import { allocatorMock, mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockUserRewards, 'page'>

export type MockUserRewards = () => Promise<void>

export const createMockUserRewards: Wrapper = ({ page }) => (
  async () => {
    await mockCustomDataOnce<any>({
      page,
      name: 'UserRewards',
      data: {
        allocator: allocatorMock,
      },
    })
  }
)
