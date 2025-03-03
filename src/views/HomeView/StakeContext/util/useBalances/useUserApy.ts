import { useCallback } from 'react'
import { initialState } from 'sw-store/store/vault'
import { useConfig } from 'config'


type Input = {
  vaultAddress: string
  userAddress: string
}

const useUserApy = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    const { userAddress, vaultAddress } = values

    try {
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
