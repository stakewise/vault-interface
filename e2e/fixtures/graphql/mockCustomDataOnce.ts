import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockCustomDataOnce, 'page'>

type Input<T> = Omit<Parameters<typeof mockCustomDataOnce>[0], 'page' | 'data'> & {
  data: T
}

export type MockCustomDataOnce = <T>(values: Input<T>) => Promise<void>

export const createMockCustomDataOnce: Wrapper = ({ page }) => (
  async <T>(values: Input<T>) => {
    const { name, data } = values

    await mockCustomDataOnce<T>({ page, name, data })
  }
)
