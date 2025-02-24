import { useCallback } from 'react'
// import { fetchApyQuery } from 'graphql/subgraph/swap' // TODO replace with sdk
import { ZeroAddress } from 'ethers'
import { useConfig } from 'config'
import methods from 'sw-methods'


const useAPY = (vaultAddress: string) => {
  const { signSDK, address } = useConfig()

  return useCallback(async () => {
    try {
      // const data = await fetchApyQuery({
      //   requestPolicy: 'no-cache',
      //   url: signSDK.config.api.subgraph,
      //   variables: {
      //     vaultAddress: vaultAddress.toLowerCase(),
      //     userAddress: address?.toLowerCase() || ZeroAddress,
      //   },
      // })
      const data = {
        vaults: [],
        osTokenHolders: [],
      }

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
      return Promise.reject('Stake: fetchAPY error')
    }
  }, [ signSDK, address, vaultAddress ])
}


export default useAPY
