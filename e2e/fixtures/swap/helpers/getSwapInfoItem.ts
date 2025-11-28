type Wrapper = E2E.FixtureMethod<GetSwapInfoItem, 'page'>

export type GetSwapInfoItem = (type: SwapInfoTypes) => Promise<string>

type SwapInfoTypes = (
  | 'gas'
  | 'apy-prev'
  | 'apy-next'
  | 'asset-prev'
  | 'asset-next'
)

export const createGetSwapInfoItem: Wrapper = ({ page }) => (
  async (type: SwapInfoTypes) => {
    const selector = await page.waitForSelector(`[data-testid="table-${type}"]`)
    const value = await selector.textContent()

    return value || ''
  }
)
