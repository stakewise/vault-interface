import { useCallback, useMemo } from 'react'
import { useUnboostSubmit, useBalances } from 'hooks'
import { useConfig } from 'config'


type Input = Pick<StakePage.Context, 'percentField' | 'vaultAddress' | 'data' | 'unboostQueue'>

export const mockUnlock: StakePage.Unboost.Actions = {
  submit: () => {},
  isDisabled: true,
  isSubmitting: true,
}

const useUnlock = (values: Input) => {
  const { vaultAddress, percentField, unboostQueue, data } = values

  const { address, chainId, cancelOnChange } = useConfig()

  const isDisabled = (
    data.isFetching
    || data.boost.shares === 0n
    || data.boost.exitingPercent > 0
  )

  const { isSubmitting, submit } = useUnboostSubmit({
    rewards: data.boost.rewardAssets,
    shares: data.boost.shares,
    vaultAddress,
  })

  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()

  const handleSubmit = useCallback(async () => {
    const percent = Number(percentField.value || 0)

    const onSuccess = cancelOnChange({
      address,
      chainId,
      logic: async () => {
        percentField.reset()
        unboostQueue.refetchData()
        refetchNativeTokenBalance()

        await Promise.all([
          data.refetchData(),
          refetchMintTokenBalance(),
        ])
      },
    })

    await submit({ percent, onSuccess })
  }, [
    data,
    address,
    chainId,
    percentField,
    unboostQueue,
    submit,
    cancelOnChange,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
  ])

  return useMemo(() => ({
    submit: handleSubmit,
    isDisabled,
    isSubmitting,
  }), [
    isDisabled,
    isSubmitting,
    handleSubmit,
  ])
}


export default useUnlock
