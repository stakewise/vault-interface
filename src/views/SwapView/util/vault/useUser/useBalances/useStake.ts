import { useCallback } from 'react'
import { constants } from 'helpers'
import { useConfig } from 'config'


type Input = {
  vaultAddress: string
  userAddress: string
}

const useStake = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    try {
      const {
        assets,
        totalEarnedAssets,
        totalStakeEarnedAssets,
        totalBoostEarnedAssets,
      } = await sdk.vault.getStakeBalance(values)

      return {
        stakedAssets: assets > constants.blockchain.minimalAmount ? assets : 0n,
        totalEarnedAssets,
        totalStakeEarnedAssets,
        totalBoostEarnedAssets,
      }
    }
    catch (error) {
      console.error('fetch vault stake user data error', error as Error)

      return {
        stakedAssets: 0n,
        totalEarnedAssets: 0n,
        totalStakeEarnedAssets: 0n,
        totalBoostEarnedAssets: 0n,
      }
    }
  }, [ sdk ])
}


export default useStake
