import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
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
      const response = await sdk.vault.getStakeBalance(values)

      const result: Store['vault']['user']['balances']['stake'] = response

      return {
        assets: result.assets > constants.blockchain.minimalAmount
          ? result.assets
          : 0n,
      }
    }
    catch (error) {
      console.error('fetch vault stake user data error', error as Error)

      return initialState.user.balances.stake
    }
  }, [ sdk ])
}


export default useStake
