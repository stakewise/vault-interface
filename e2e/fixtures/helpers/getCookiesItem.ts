import type { Cookie } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<GetCookiesItem, 'page'>

export type GetCookiesItem = (key: string) => Promise<Cookie | undefined>

export const createGetCookiesItem: Wrapper = ({ page }) => (
  async (key: string) => {
    const context = page.context()
    const cookies = await context.cookies()

    const currentCookie = cookies.find((cookie) => cookie.name === key)

    return currentCookie
  }
)
