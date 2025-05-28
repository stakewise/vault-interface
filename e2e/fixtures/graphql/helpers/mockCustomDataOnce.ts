import type { Route, Page } from '@playwright/test'


type Input<T> = {
  name: string
  page: Page
  data: T
}

const mockCustomDataOnce = async <T>(input: Input<T>) => {
  const { name, page, data } = input

  const match = new RegExp(`opName=${name}(?:&|$)`)

  const handler = (route: Route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data }),
    })

    page.unroute(match, handler)
  }

  await page.route(match, handler)
}


export default mockCustomDataOnce
