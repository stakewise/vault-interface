import { useCallback, useMemo } from 'react'
import { useBalances, useStore, useUnboostSubmit } from 'hooks'
import { useConfig } from 'config'


type Output = {
  isDisabled: boolean
  submit: (percent: number) => Promise<void>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const storeSelector = (store: Store) => ({
  boostedShares: store.vault.user.balances.boost.shares,
  rewardAssets: store.vault.user.balances.boost.rewardAssets,
  exitingPercent: store.vault.user.balances.boost.exitingPercent,
})

const useUnboost: Hook = (params) => {
  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()

  const { vaultAddress } = params

  const { address, chainId, cancelOnChange } = useConfig()
  const { boostedShares, rewardAssets, exitingPercent } = useStore(storeSelector)

  const { submit } = useUnboostSubmit({
    rewards: rewardAssets,
    shares: boostedShares,
    vaultAddress,
  })

  const isDisabled = boostedShares === 0n || exitingPercent > 0

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
    isDisabled,
    submit: handleSubmit,
  }), [
    isDisabled,
    handleSubmit,
  ])
}

useUnboost.mock = {
  isDisabled: true,
  submit: async () => {},
}


export default useUnboost
