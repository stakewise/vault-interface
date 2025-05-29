type Wrapper = E2E.FixtureMethod<SetTheme, 'page' | 'helpers'>

type Input = 'dark' | 'light'

export type SetTheme = (theme: Input) => Promise<void>

export const createSetTheme: Wrapper = ({ page, helpers }) => (
  async (theme: Input) => {
    await page.getByTestId('settings-toggle-button').click()
    await helpers.changeSelect('settings-theme', theme)
  }
)
