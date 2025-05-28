type Wrapper = E2E.FixtureMethod<MockApy, 'graphql'>

type Input = {
  userApy?: string
  vaultApy?: string
  isProfitable?: boolean
}

type Output = {
  userApy: number
  vaultApy: number
  osTokenApy: number
  feePercent: number
  maxBoostApy: number
}

export type MockApy = (values: Input) => Promise<Output>

export const createMockApy: Wrapper = ({ graphql }) => (
  async (values: Input) => {
    const { userApy = '1.99', vaultApy = '1.25', isProfitable } = values

    const feePercent = 100
    const osTokenApy = '2.05'
    const maxBoostApy = isProfitable ? '4.22' : osTokenApy

    await graphql.mockSwapApy({
      userApy,
      vaultApy,
      osTokenApy,
      maxBoostApy,
      feePercent,
    })

    return {
      feePercent,
      userApy: Number(userApy),
      vaultApy: Number(vaultApy),
      osTokenApy: Number(osTokenApy),
      maxBoostApy: Number(maxBoostApy),
    }
  }
)
