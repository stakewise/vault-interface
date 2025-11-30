type Wrapper = E2E.FixtureMethod<GetSwapInfoItem, 'page'>

export type GetSwapInfoItem = (type: SwapInfoTypes) => Promise<string>

type SwapInfoTypes = (
  | 'gas'
  | 'rate'
  | 'fee'
  | 'apy-prev'
  | 'apy-next'
  | 'asset-prev'
  | 'asset-next'
  | 'shares-prev'
  | 'shares-next'
  | 'unstake-queue'
  | 'exiting-shares'
  | 'exiting-rewards'
)

export const createGetSwapInfoItem: Wrapper = ({ page }) => (
  async (type: SwapInfoTypes) => {
    const selector = await page.waitForSelector(`[data-testid="table-${type}"]`)
    const value = await selector.textContent()

    return value || ''
  }
)
