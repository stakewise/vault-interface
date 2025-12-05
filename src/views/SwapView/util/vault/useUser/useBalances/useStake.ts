import { useCallback } from 'react'
import { useConfig } from 'config'
import { constants, methods } from 'helpers'


type Input = {
  vaultAddress: string
  userAddress: string
}

type Output = Pick<Store['vault']['user']['balances'],
  'stakedAssets'
  | 'totalEarnedAssets'
  | 'totalStakeEarnedAssets'
  | 'totalBoostEarnedAssets'
>

const useStake = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    try {
      const mockE2E = methods.insertMockE2E<Output>('user/balances/setStakeBalance')

      if (mockE2E) {
        return mockE2E
      }

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
