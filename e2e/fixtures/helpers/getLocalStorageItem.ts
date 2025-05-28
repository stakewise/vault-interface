type Wrapper = E2E.FixtureMethod<GetLocalStorageItem, 'page'>

export type GetLocalStorageItem = (key: string) => any

export const createGetLocalStorageItem: Wrapper = ({ page }) => (
  async (key: string) => {
    const value = await page.evaluate((key) => (
      // eslint-disable-next-line no-restricted-globals
      localStorage.getItem(key)
    ), key)

    const parsedValue = JSON.parse(value || '')

    return parsedValue
  }
)
