export type SetUserApy = (apy: number) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetUserApy, 'page'>

export const createSetUserApy: Wrapper = ({ page }) => (
  async (apy: number) => {
    await page.addInitScript((payload) => {
      window.e2e = {
        ...window.e2e,
        ['user/balances/setUserApy']: payload,
      }
    }, apy)
  }
)
