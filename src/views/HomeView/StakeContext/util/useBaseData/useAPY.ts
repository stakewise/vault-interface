import { useCallback } from 'react'
import { ZeroAddress } from 'ethers'
import { useConfig } from 'config'
import methods from 'sw-methods'


type ApyQueryPayload = {
  osToken: {
    apy: number
    feePercent: number
  }
  vaults: {
    apy: number
    feePercent: number
    osTokenHolderMaxBoostApy: number
    osTokenConfig: {
      ltvPercent: number
    }
  }[]
  osTokenHolders: {
    apy: number
  }[]
}

const useAPY = (vaultAddress: string) => {
  const { sdk, address } = useConfig()

  return useCallback(async () => {
    try {
      const data = await methods.fetch<ApyQueryPayload>(sdk.config.api.subgraph, {
        method: 'POST',
        body: JSON.stringify({
          query: `
            query Apy($userAddress: ID!, $vaultAddress: ID!) {
              osToken(id: "1") {
                apy
                feePercent
              }
              vaults(where: { id: $vaultAddress }) {
                apy
                feePercent
                osTokenHolderMaxBoostApy
                osTokenConfig {
                  ltvPercent
                }
              }
              osTokenHolders(where: { id: $userAddress }) {
                apy
              }
            }
          `,
          variables: {
            vaultAddress: vaultAddress.toLowerCase(),
            userAddress: address?.toLowerCase() || ZeroAddress,
          },
        }),
      })

      const vaultData = data.vaults[0]
      const mintTokenData = data.osToken
      const userAPY = Number(data.osTokenHolders[0]?.apy || 0)

      const ltvPercent = BigInt(vaultData?.osTokenConfig?.ltvPercent || 0)
      const fee = methods.formatApy((mintTokenData.feePercent + vaultData.feePercent) / 100)

      const apy = {
        user: 0,
        vault: Number(vaultData.apy),
        mintToken: Number(mintTokenData.apy),
        maxBoost: Number(vaultData.osTokenHolderMaxBoostApy),
      }

      if (address && userAPY) {
        apy.user = userAPY
      }

      return {
        fee,
        apy,
        ltvPercent,
      }
    }
    catch (error) {
      console.error(error)
      return Promise.reject('Stake: fetchAPY error')
    }
  }, [ sdk, address, vaultAddress ])
}


export default useAPY
