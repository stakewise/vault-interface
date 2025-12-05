import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
import { useConfig } from 'config'
import { methods } from 'helpers'


type Input = {
  vaultAddress: string
  userAddress: string
}

type Output = Store['vault']['user']['balances']['boost']

const useBoost = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    try {
      const mockE2E = methods.insertMockE2E<Output>('user/balances/setBoostData')

      if (mockE2E) {
        return mockE2E
      }

      const result: Output = await sdk.boost.getData(values)

      return result
    }
    catch (error) {
      console.error('fetch vault boost user data error', error as Error)

      return initialState.user.balances.boost
    }
  }, [ sdk ])
}


export default useBoost
