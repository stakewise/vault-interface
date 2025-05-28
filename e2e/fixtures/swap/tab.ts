type Wrapper = E2E.FixtureMethod<Tab, 'page'>

type Tabs = 'stake' | 'unstake' | 'boost' | 'unboost' | 'balance' | 'mint' | 'burn'

export type Tab = (tab: Tabs, flip?: boolean) => Promise<void>

export const createTab: Wrapper = ({ page }) => (
  async (tab: Tabs, flip?: boolean) => {
    if (flip) {
      await page.getByTestId('flip-tabs').click()
    }

    await page.getByTestId(`tab-${tab}`).click()
  }
)
