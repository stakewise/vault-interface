import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
import { useConfig } from 'config'


type Input = {
  vaultAddress: string
  userAddress: string
}

const useBoost = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    try {
      const response = await sdk.boost.getData(values)

      const result: Store['vault']['user']['balances']['boost'] = response

      return result
    }
    catch (error) {
      console.error('fetch vault boost user data error', error as Error)

      return initialState.user.balances.boost
    }
  }, [ sdk ])
}


export default useBoost
