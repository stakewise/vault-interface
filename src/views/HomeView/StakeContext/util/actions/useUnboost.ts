import { useCallback, useMemo } from 'react'
import { useBalances, useStore, useUnboostSubmit } from 'hooks'
import { useConfig } from 'config'


type Output = {
  submit: (percent: number) => Promise<void>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  rewardAssets: store.vault.user.balances.boost.rewardAssets,
})

const useUnboost: Hook = (params) => {
  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()

  const { vaultAddress } = params

  const { address, chainId, cancelOnChange } = useConfig()
  const { boostedShares, rewardAssets } = useStore(storeSelector)

  const { submit } = useUnboostSubmit({
    rewards: rewardAssets,
    shares: boostedShares,
    vaultAddress,
  })

  const handleSubmit = useCallback(async (percent: number) => {
    const onSuccess = cancelOnChange({
      address,
      chainId,
      logic: async () => {
        refetchMintTokenBalance()
        refetchNativeTokenBalance()
        params.fetch.unboostQueue()
        await params.fetch.data()
      },
    })

    await submit({ percent, onSuccess })
  }, [
    params,
    chainId,
    address,
    submit,
    cancelOnChange,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
  ])

  return useMemo(() => ({
    submit: handleSubmit,
  }), [
    handleSubmit,
  ])
}

useUnboost.mock = {
  submit: async () => {},
}


export default useUnboost
