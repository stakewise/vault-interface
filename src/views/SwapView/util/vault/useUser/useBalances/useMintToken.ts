import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
import * as methods from 'helpers/methods'
import { constants } from 'helpers'
import { useConfig } from 'config'


type OsTokenEnabledQueryPayload = {
  vault: {
    isOsTokenEnabled: boolean
  }
}

type Input = {
  userAddress: string
  vaultAddress: string
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

      const [ minted, maxMintShares ] = await Promise.all([
        sdk.osToken.getBalance(values),
        sdk.osToken.getMaxMintAmount(values),
      ])

      // We can never withdraw all osETH tokens since they are accrued every second.
      // So we have to look at the dust and assume that osETH just isn't there
      const hasMintBalance = minted.assets > constants.blockchain.minimalAmount

      const mintToken: Output = {
        maxMintShares,
        hasMintBalance,
        isDisabled: false,
        mintedShares: minted.shares,
        mintedAssets: minted.assets,
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
