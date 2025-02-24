import { useCallback, useMemo } from 'react'
import { useConfig } from 'config'
import { useBoostSubmit, useBoostSupplyCapsCheck, useBalances } from 'hooks'

import useAPY from '../useBaseData/useAPY'


type Input = Pick<StakePage.Context, 'field' | 'vaultAddress' | 'unstakeQueue' | 'data'>

export const mockLock: StakePage.Boost.Actions = {
  allowance: 0n,
  isFetching: true,
  isSubmitting: false,
  isAllowanceFetching: false,
  checkSupplyCap:  () => true,
  submit: () => Promise.resolve(),
}

const useLock = (values: Input) => {
  const { vaultAddress, data, field } = values

  const fetchAPY = useAPY(vaultAddress)
  const { chainId, address, isGnosis, cancelOnChange } = useConfig()
  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()
  const { allowance, isSubmitting, isAllowanceFetching, submit } = useBoostSubmit(vaultAddress)

  const supplyCaps = useBoostSupplyCapsCheck({
    ltvPercent: data.ltvPercent,
    skip: isGnosis,
  })

  const handleGetUserApy = useCallback(async () => {
    const { apy } = await fetchAPY()

    return apy.user
  }, [ fetchAPY ])

  const handleSubmit = useCallback(async (values?: StakePage.Boost.SubmitInput) => {
    const { permitAddress, setTransaction } = values || {}

    const amount = field.value as bigint

    const onSuccess = cancelOnChange({
      chainId,
      address,
      logic: async () => {
        field.reset()
        refetchNativeTokenBalance()

        await Promise.all([
          data.refetchData(),
          refetchMintTokenBalance(),
        ])
      },
    })

    await submit({
      amount,
      permitAddress,
      onSuccess,
      setTransaction,
      getUserApy: handleGetUserApy,
    })
  }, [
    data,
    field,
    chainId,
    address,
    submit,
    cancelOnChange,
    handleGetUserApy,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
  ])

  return useMemo(() => ({
    ...supplyCaps,
    allowance,
    isSubmitting,
    isAllowanceFetching,
    submit: handleSubmit,
    isFetching: supplyCaps.isFetching,
  }), [
    allowance,
    supplyCaps,
    isSubmitting,
    isAllowanceFetching,
    handleSubmit,
  ])
}


export default useLock
