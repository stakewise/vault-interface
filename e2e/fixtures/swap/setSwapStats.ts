type Output = {
  totalAssets: string
  totalEarnedAssets: string
}

export type SetSwapStats = () => Promise<Output>

type Wrapper = E2E.FixtureMethod<SetSwapStats, 'page'>

export const createSetSwapStats: Wrapper = ({ page }) => (
  async () => {
    const stats =  {
      totalAssets: '100000000000000000000',
      totalEarnedAssets: '10000000000000000000',
    }

    await page.addInitScript((payload) => {
      window.e2e = {
        ...window.e2e,
        ['fixtures/swap/setSwapStats']: payload,
      }
    }, stats)

    return stats
  }
)
