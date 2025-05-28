import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockTransaction, 'page'>

export type MockTransaction = () => Promise<void>

export const createMockTransaction: Wrapper = ({ page }) => (
  async () => {
    await mockCustomDataOnce<any>({
      page,
      name: 'Transactions',
      data: {
        transactions: [
          {
            id: '0x8c2347bf7599c06fda87cbb12579039ab9d4124dfc5db411c2b7137d8fb2db3a',
          },
        ],
      },
    })
  }
)
