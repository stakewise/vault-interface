import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
import { constants } from 'helpers'
import { useConfig } from 'config'
import methods from 'helpers/methods'


type OsTokenEnabledQueryPayload = {
  vault: {
    isOsTokenEnabled: boolean
  }
}

type Input = {
  ltvPercent: bigint
  userAddress: string
  stakedAssets: bigint
  vaultAddress: string
  liqThresholdPercent: bigint
}

type Output = Store['vault']['user']['balances']['mintToken']

const useMintToken = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    try {
      const data = await methods.fetch<OsTokenEnabledQueryPayload>(sdk.config.api.subgraph, {
        method: 'POST',
        body: JSON.stringify({
          query: `
            query OsTokenEnabled($address: ID!) {
              vault(id: $address) {
                isOsTokenEnabled
              }
            }
          `,
          variables: {
            address: values.vaultAddress.toLowerCase(),
          },
        }),
      })

      const isMintTokenEnabled = data?.vault?.isOsTokenEnabled

      if (!isMintTokenEnabled) {
        return {
          ...initialState.user.balances.mintToken,
          isDisabled: true,
        }
      }

      const baseData = await sdk.osToken.getPosition(values)

      const maxMintShares = await sdk.osToken.getMaxMint({
        mintedAssets: baseData.minted.assets,
        ...values,
      })

      // We can never withdraw all osETH tokens since they are accrued every second.
      // So we have to look at the dust and assume that osETH just isn't there
      const hasMintBalance = baseData.minted.assets > constants.blockchain.minimalAmount

      const mintToken: Output = {
        ...baseData,
        maxMintShares,
        hasMintBalance,
        isDisabled: false,
      }

      return mintToken
    }
    catch (error) {
      console.error('fetch vault mint token user data error', error as Error)

      return initialState.user.balances.mintToken
    }
  }, [ sdk ])
}


export default useMintToken
