type Output = {
  totalAssets: string
  totalEarnedAssets: string
}

export type SwapStats = () => Promise<Output>

type Wrapper = E2E.FixtureMethod<SwapStats, 'page'>

export const createSwapStats: Wrapper = ({ page }) => (
  async () => {
    const stats =  {
      totalAssets: '100000000000000000000',
      totalEarnedAssets: '10000000000000000000',
    }

    await page.addInitScript((payload) => {
      window.e2e = {
        ...window.e2e,
        ['fixtures/swap/mocks/swapStats']: payload,
      }
    }, stats)

    return stats
  }
)
