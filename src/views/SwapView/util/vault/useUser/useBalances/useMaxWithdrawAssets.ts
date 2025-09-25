import { useCallback } from 'react'
import { initialState } from 'store/store/vault'
import { useConfig } from 'config'


type Input = {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  vaultAddress: string
}

const useMaxWithdrawAssets = () => {
  const { sdk } = useConfig()

  return useCallback(async (values: Input) => {
    try {
      const maxAssets = await sdk.vault.getMaxWithdraw(values)

      const result: Store['vault']['user']['balances']['maxWithdrawAssets'] = maxAssets

      return result
    }
    catch (error) {
      console.error('fetch vault withdraw user data error', error as Error)

      return initialState.user.balances.maxWithdrawAssets
    }
  }, [ sdk ])
}


export default useMaxWithdrawAssets
