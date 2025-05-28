import { mockCustomData } from './helpers'


type Wrapper = E2E.FixtureMethod<MockCustomData, 'page'>

type Input<T> = Omit<Parameters<typeof mockCustomData>[0], 'page' | 'data'> & {
  data: T
}

export type MockCustomData = <T>(values: Input<T>) => Promise<void>

export const createMockCustomData: Wrapper = ({ page }) => (
  async <T>(values: Input<T>) => {
    const { name, data } = values

    await mockCustomData<T>({ page, name, data })
  }
)
