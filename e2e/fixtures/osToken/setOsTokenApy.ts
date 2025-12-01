type Input = {
  apy: string
  feePercent?: number
}

export type SetOsTokenApy = (values: Input) => Promise<void>

type Wrapper = E2E.FixtureMethod<SetOsTokenApy, 'page'>

export const createSetOsTokenApy: Wrapper = ({ page }) => (
  async (values) => {
    await page.addInitScript((payload) => {
      window.e2e = {
        ...window.e2e,
        ['fixtures/osToken/setOsTokenApy']: {
          feePercent: payload.feePercent || 100,
          apy: payload.apy,
        },
      }
    }, values)
  }
)
