import type { Route } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<MockEstimateGas, 'page'>

type Unroute = () => Promise<void>

export type MockEstimateGas = () => Promise<Unroute>

export const createMockEstimateGas: Wrapper = ({ page }) => (
  async () => {
    const handler = async (route: Route) => {
      const request = route.request()
      const response = await route.fetch()
      const json = await response.json()

      if (json.error) {
        const payload = JSON.parse(request.postData() || '{}')

        if (payload.method === 'eth_estimateGas') {
          json.error = undefined
          json.result = '0x5f62'
        }
      }

      await route.fulfill({ response, json })
    }

    await page.route(/:8545/, handler)

    return () => page.unroute(/:8545/, handler)
  }
)
