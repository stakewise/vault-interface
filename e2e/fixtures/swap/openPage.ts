type Wrapper = E2E.FixtureMethod<OpenPage, 'page'>

export type OpenPage = (query?: string) => Promise<void>

export const createOpenPage: Wrapper = ({ page }) => (
  async (query) => {
    await page.goto(query ? `/?${query}` : '/')
    await page.waitForSelector('[data-testid="tab-stake"]')
  }
)
