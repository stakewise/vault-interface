import type { Route, Page } from '@playwright/test'


type Input<T> = {
  name: string
  page: Page
  data: T
}

const mockCustomData = async <T>(input: Input<T>) => {
  const { name, data, page } = input

  const match = new RegExp(`opName=${name}(?:&|$)`)

  const handler = (route: Route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data }),
    })
  }

  await page.route(match, handler)

  return () => page.unroute(match, handler)
}


export default mockCustomData
