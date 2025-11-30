import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
import { useConfig } from 'config'
import { methods } from 'helpers'


type Input = {
  userAddress: string
  vaultAddress: string
}

type Output = Store['vault']['user']['balances']['maxWithdrawAssets']

const useMaxWithdrawAssets = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    try {

      const mockE2E = methods.insertMockE2E<Output>('user/balances/setMaxWithdrawAssets')

      if (mockE2E) {
        return mockE2E
      }

      const result: Output = await sdk.vault.getMaxWithdrawAmount(values)

      return result
    }
    catch (error) {
      console.error('fetch vault withdraw user data error', error as Error)

      return initialState.user.balances.maxWithdrawAssets
    }
  }, [ sdk ])
}


export default useMaxWithdrawAssets
