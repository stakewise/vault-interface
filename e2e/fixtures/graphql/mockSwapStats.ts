import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockSwapStats, 'page'>

type Output = {
  usersCount: number
  totalAssets: string
  totalEarnedAssets: string
}

export type MockSwapStats = () => Promise<Output>

export const createMockSwapStats: Wrapper = ({ page }) => (
  async () => {
    const stats = {
      usersCount: 1000,
      totalAssets: '100000000000000000000',
      totalEarnedAssets: '10000000000000000000',
    }

    await mockCustomDataOnce<any>({
      page,
      name: 'Stats',
      data: {
        networks: [
          stats,
        ],
      },
    })

    return stats
  }
)
