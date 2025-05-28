type Wrapper = E2E.FixtureMethod<Delay>

export type Delay = (ms: number) => Promise<unknown>

export const createDelay: Wrapper = () => (
  async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
)
