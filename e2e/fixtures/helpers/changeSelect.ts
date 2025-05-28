type Wrapper = E2E.FixtureMethod<ChangeSelect, 'page'>

export type ChangeSelect = (selectId: string, optionId: string) => Promise<void>

export const createChangeSelect: Wrapper = ({ page }) => (
  async (selectId: string, optionId: string) => {
    await page.getByTestId(`${selectId}-button`).click()
    await page.waitForSelector(`[data-testid="${selectId}-options"]`)
    await page.getByTestId(`${selectId}-option-${optionId}`).click()
  }
)
