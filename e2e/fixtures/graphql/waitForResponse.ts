import type { Response } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<WaitForResponse, 'page'>

export type WaitForResponse = (opName: string) => Promise<Response>

export const createWaitForResponse: Wrapper = ({ page }) => (
  async (opName: string) => {
    return page.waitForResponse((response) => {
      const url = response.url()
      const status = response.status()

      return url.includes(`?opName=${opName}`) && status === 200
    })
  }
)
