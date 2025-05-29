import { mockCustomDataOnce } from './helpers'
import { createMockMintTokenApy } from './mockMintTokenApy'


type Wrapper = E2E.FixtureMethod<MockSwapApy, 'page'>

type Input = {
  userApy: string
  vaultApy: string
  feePercent: number
  osTokenApy: string
  maxBoostApy: string
}

export type MockSwapApy = (values: Input) => Promise<void>

export const createMockSwapApy: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { osTokenApy, maxBoostApy, userApy, vaultApy, feePercent } = values

    const mockMintTokenApy = createMockMintTokenApy({ page })

    await Promise.all([
      mockMintTokenApy(osTokenApy),
      mockCustomDataOnce<any>({
        page,
        name: 'Apy',
        data: {
          osToken: {
            apy: osTokenApy,
            feePercent,
          },
          vaults: [
            {
              apy: vaultApy,
              feePercent,
              osTokenHolderMaxBoostApy: maxBoostApy,
              osTokenConfig: {
                ltvPercent: '999900000000000000',
              },
            },
          ],
          osTokenHolders: [
            {
              apy: userApy,
            },
          ],
        },
      }),
    ])
  }
)
