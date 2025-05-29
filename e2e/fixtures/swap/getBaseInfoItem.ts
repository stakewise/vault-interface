type Wrapper = E2E.FixtureMethod<GetBaseInfoItem, 'page'>

export type GetBaseInfoItem = (type: BaseInfoTypes) => Promise<number>

type BaseInfoTypes = 'os-token-apy' | 'max-boost-apy' | 'stake-tvl' | 'stake-users' | 'vault-apy'

export const createGetBaseInfoItem: Wrapper = ({ page }) => (
  async (type: BaseInfoTypes) => {
    const value = await page.getByTestId(type).textContent()

    const result = parseFloat(value?.replace(/\,/gm, '') || '')

    return result
  }
)
