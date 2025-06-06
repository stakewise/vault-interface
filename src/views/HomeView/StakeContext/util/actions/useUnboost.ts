import { useCallback, useMemo } from 'react'
import { useBalances, useStore } from 'hooks'
import { useConfig } from 'config'

import useUnboostSubmit from './useUnboostSubmit'


type Output = {
  isDisabled: boolean
  isSubmitting: boolean
  submit: () => Promise<void>
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

  const { vaultAddress, percentField } = params

  const { address, chainId, cancelOnChange } = useConfig()
  const { boostedShares, rewardAssets, exitingPercent } = useStore(storeSelector)

  const { isSubmitting, submit } = useUnboostSubmit({
    rewards: rewardAssets,
    shares: boostedShares,
    vaultAddress,
  })

  const isDisabled = boostedShares === 0n || exitingPercent > 0

  const handleSubmit = useCallback(async () => {
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

    await submit({ percent: Number(percentField.value), onSuccess })
  }, [
    params,
    chainId,
    address,
    percentField,
    submit,
    cancelOnChange,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
  ])

  return useMemo(() => ({
    isDisabled,
    isSubmitting,
    submit: handleSubmit,
  }), [
    isDisabled,
    isSubmitting,
    handleSubmit,
  ])
}

useUnboost.mock = {
  isDisabled: true,
  isSubmitting: false,
  submit: async () => {},
}


export default useUnboost
