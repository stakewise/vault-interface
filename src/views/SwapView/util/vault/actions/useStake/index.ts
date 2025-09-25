import { useMemo } from 'react'
import { useStore } from 'hooks'

import vaultHooks from '../../index'

import useStakeField from './useStakeField'
import useStakeSubmit from './useStakeSubmit'
import useStakeDisabled from './useStakeDisabled'
import useStakeMaxAmount from './useStakeMaxAmount'
import { useSwapTokens, useSwapQuote, useSwapActions } from './swap'


type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  isBalancesFetching: store.vault.user.balances.isFetching,
})

const useStake = (values: Input) => {
  const { fetchAllUserData } = values

  const swapTokens = useSwapTokens()
  const { isBalancesFetching } = useStore(storeSelector)

  const {
    swapFee,
    isSwapQuoteFetching,
    fetchQuote,
    getSwappedDepositAmount,
  } = useSwapQuote({ swapTokens })

  const field = useStakeField({
    swapFee,
    swapTokens,
    getSwappedDepositAmount,
  })

  const { swap, cancelSwap } = useSwapActions({
    field,
    swapTokens,
    fetchQuote,
  })

  const { submit, transactionPrice, isSubmitting, isAllowanceFetching } = useStakeSubmit({
    swapTokens,
    field,
    swap,
    cancelSwap,
    fetchAllUserData,
  })

  const isStakeDisabled = useStakeDisabled({ field })
  const maxStakeAmount = useStakeMaxAmount({ swapTokens, transactionPrice })

  const isStakeLoading = (
    isSubmitting
    || isBalancesFetching
    || isSwapQuoteFetching
    || isAllowanceFetching
  )

  return useMemo(() => ({
    field,
    swapTokens,
    maxStakeAmount,
    isStakeLoading,
    isStakeDisabled,
    transactionPrice,
    submit,
    fetchQuote,
    getSwappedDepositAmount,
  }), [
    field,
    swapTokens,
    maxStakeAmount,
    isStakeLoading,
    isStakeDisabled,
    transactionPrice,
    submit,
    fetchQuote,
    getSwappedDepositAmount,
  ])
}

useStake.mock = {
  maxStakeAmount: 0n,
  transactionPrice: 0n,
  isStakeLoading: false,
  isStakeDisabled: false,
  swapTokens: useSwapTokens.mock,
  field: {} as Forms.Field<bigint>,
  fetchQuote: () => ({}) as any,
  submit: () => Promise.resolve(),
  getSwappedDepositAmount: () => 0n,
} as ReturnType<typeof useStake>


export default useStake
