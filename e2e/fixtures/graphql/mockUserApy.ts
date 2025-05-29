import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockUserApy, 'page'>

export type MockUserApy = (apy: string) => Promise<void>

export const createMockUserApy: Wrapper = ({ page }) => (
  async (apy: string) => {
    await mockCustomDataOnce<any>({
      page,
      name: 'UserApy',
      data: {
        allocators: [
          {
            apy,
          },
        ],
      },
    })
  }
)
