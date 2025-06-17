import { useCallback, useMemo } from 'react'
import { useBalances } from 'hooks'
import { useConfig } from 'config'

import useBoostSubmit from './useBoostSubmit'


type SubmitInput = Omit<Parameters<ReturnType<typeof useBoostSubmit>['submit']>[0], 'onSuccess'>

type Output = {
  allowance: bigint
  isSubmitting: boolean
  isAllowanceFetching: boolean
  submit: (input: SubmitInput) => Promise<void>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const useBoost: Hook = (params) => {
  const { field, fetch, vaultAddress } = params

  const { signSDK, address, chainId, cancelOnChange } = useConfig()
  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()
  const { allowance, isAllowanceFetching, isSubmitting, submit } = useBoostSubmit(vaultAddress)

  const handleGetUserApy = useCallback(async () => {
    if (!address) {
      return 0
    }

    const userAPY = await signSDK.vault.getUserApy({
      userAddress: address,
      vaultAddress,
    })

    return userAPY
  }, [ address, signSDK, vaultAddress ])

  const handleSubmit = useCallback(async (values: SubmitInput) => {
    const { amount, setTransaction } = values

    if (!address) {
      return
    }

    const onSuccess = cancelOnChange({
      address,
      chainId,
      logic: () => {
        field.reset()

        fetch.data()
        fetch.balances()

        refetchMintTokenBalance()
        refetchNativeTokenBalance()
      },
    })

    await submit({
      amount,
      getUserApy: handleGetUserApy,
      setTransaction,
      onSuccess,
    })
  }, [
    field,
    fetch,
    chainId,
    address,
    submit,
    cancelOnChange,
    handleGetUserApy,
    refetchMintTokenBalance,
    refetchNativeTokenBalance,
  ])

  return useMemo(() => ({
    allowance,
    isSubmitting,
    isAllowanceFetching,
    submit: handleSubmit,
  }), [
    allowance,
    isSubmitting,
    isAllowanceFetching,
    handleSubmit,
  ])
}

useBoost.mock = {
  allowance: 0n,
  isSubmitting: false,
  isAllowanceFetching: false,
  submit: async () => {},
}


export default useBoost
