import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
import { useConfig } from 'config'
import { methods } from 'helpers'


type Input = {
  vaultAddress: string
  userAddress: string
}

const useUserApy = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    const { userAddress, vaultAddress } = values

    try {
      const mockE2E = methods.insertMockE2E<Promise<number>>('user/balances/setUserApy')

      if (mockE2E) {
        return mockE2E
      }

      const userAPY = await sdk.vault.getUserApy({
        userAddress,
        vaultAddress,
      })

      return userAPY
    }
    catch (error) {
      console.error('fetch user apy error', error as Error)

      return initialState.user.balances.userAPY
    }
  }, [ sdk ])
}


export default useUserApy
