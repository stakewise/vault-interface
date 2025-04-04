import { useCallback, useMemo } from 'react'
import { useBalances } from 'hooks'
import { useConfig } from 'config'

import useBoostSubmit from './useBoostSubmit'


type SubmitInput = Omit<Parameters<ReturnType<typeof useBoostSubmit>['submit']>[0], 'onSuccess'>

type Output = {
  allowance: bigint
  isAllowanceFetching: boolean
  submit: (input: SubmitInput) => Promise<void>
}

interface Hook {
  (params: StakePage.Params): Output
  mock: Output
}

const useBoost: Hook = (params) => {
  const { refetchMintTokenBalance, refetchNativeTokenBalance } = useBalances()

  const { vaultAddress } = params
  const { signSDK, address, chainId, cancelOnChange } = useConfig()
  const { allowance, isAllowanceFetching, submit } = useBoostSubmit(vaultAddress)

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
      logic: async () => {
        refetchMintTokenBalance()
        refetchNativeTokenBalance()
        await params.fetch.data()
      },
    })

    await submit({
      amount,
      getUserApy: handleGetUserApy,
      setTransaction,
      onSuccess,
    })
  }, [
    params,
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
    isAllowanceFetching,
    submit: handleSubmit,
  }), [
    allowance,
    isAllowanceFetching,
    handleSubmit,
  ])
}

useBoost.mock = {
  allowance: 0n,
  isAllowanceFetching: false,
  submit: async () => {},
}


export default useBoost
