type Wrapper = E2E.FixtureMethod<GetSwapInfoItem, 'page'>

export type GetSwapInfoItem = (type: SwapInfoTypes, itemType?: SwapItemType) => Promise<string>

type SwapInfoTypes = (
  'apy'
  | 'fee'
  | 'rate'
  | 'queue'
  | 'receive'
  | 'apy-prev'
  | 'apy-next'
  | 'exiting-shares'
  | 'exiting-rewards'
  | 'boosted-shares-next'
)

type SwapItemType = 'table' | 'position'

export const createGetSwapInfoItem: Wrapper = ({ page }) => (
  async (type: SwapInfoTypes, itemType: SwapItemType = 'table') => {
    const selector = await page.waitForSelector(`[data-testid="${itemType}-${type}"]`)
    const value = await selector.textContent()

    return value || ''
  }
)
