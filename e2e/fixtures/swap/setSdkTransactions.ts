import * as constants from '../../constants'


type Input = {
  mint?: string
  deposit: string
}

export type SetSdkTransactions = (values: Input) => Promise<string | undefined>

type Wrapper = E2E.FixtureMethod<SetSdkTransactions, 'page' | 'sdk' | 'graphql'>

export const createSetSdkTransactions: Wrapper = ({ page, sdk, graphql }) => (
  async (values: Input) => {
    const { deposit, mint } = values

    let shares

    await sdk.deposit({
      vaultAddress: constants.genesisAddress.mainnet,
      assets: deposit,
    })

    if (mint) {
      shares = await sdk.mint({
        vaultAddress: constants.genesisAddress.mainnet,
        assets: mint,
      })
    }

    await graphql.mockAllocatorsData(deposit)

    await page.reload()
    await page.waitForLoadState('networkidle')

    return shares
  }
)
