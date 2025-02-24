import { useCallback } from 'react'
import { useConfig } from 'config'


const mock = {
  shares: 0n,
  rewardAssets: 0n,
  exitingPercent: 0,
  maxMintShares: 0n,
  isProfitable: false,
}

const useData = (vaultAddress: string) => {
  const { sdk, address, isEthereum } = useConfig()

  return useCallback(async (mintTokenBalance: bigint) => {
    if (!address || !isEthereum) {
      return mock
    }

    try {
      const boost = await sdk.boost.getData({
        userAddress: address,
        vaultAddress,
      })

      const isProfitable = boost.osTokenHolderMaxBoostApy > boost.vaultApy

      return {
        ...boost,
        isProfitable,
        maxMintShares: boost.shares + mintTokenBalance,
      }
    }
    catch (error) {
      return Promise.reject('Stake: fetchBoostData error')
    }
  }, [ address, sdk, isEthereum, vaultAddress ])
}


export default useData
