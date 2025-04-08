import { useCallback } from 'react'
import { ZeroAddress } from 'ethers'
import { useConfig } from 'config'
import methods from 'helpers/methods'


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
}

const useAPY = (vaultAddress: string) => {
  const { sdk, address } = useConfig()

  return useCallback(async () => {
    try {
      const url = Array.isArray(sdk.config.api.subgraph)
        ? sdk.config.api.subgraph[0]
        : sdk.config.api.subgraph

      const data = await methods.fetch<ApyQueryPayload>(`${url}?opName=Apy`, {
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

      const ltvPercent = BigInt(vaultData?.osTokenConfig?.ltvPercent || 0)
      const fee = methods.formatApy((mintTokenData.feePercent + vaultData.feePercent) / 100)

      const apy = {
        vault: Number(vaultData.apy),
        mintToken: Number(mintTokenData.apy),
        maxBoost: Number(vaultData.osTokenHolderMaxBoostApy),
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
