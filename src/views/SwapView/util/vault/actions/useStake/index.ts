import { useMemo } from 'react'
import { useConfig } from 'config'
import { useStore, swapHooks } from 'hooks'

import vaultHooks from '../../index'

import useStakeField from './useStakeField'
import useStakeSubmit from './useStakeSubmit'
import useStakeDisabled from './useStakeDisabled'


type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  isBalancesFetching: store.vault.user.balances.isFetching,
})

const useStake = (values: Input) => {
  const { fetchAllUserData } = values

  const { sdk, isTestnet, isEthereum } = useConfig()
  const { isBalancesFetching } = useStore(storeSelector)

  const depositTokenAddress = isEthereum ? null : sdk.config.addresses.tokens.depositToken
  const swapTokens = swapHooks.useTokens({
    initialBuyToken: depositTokenAddress,
    initialSellToken: depositTokenAddress,
  })

  const isSwapAvailable = Boolean(
    !isTestnet
    && (
      isEthereum
        ? swapTokens.sellToken.address
        : swapTokens.sellToken.address !== sdk.config.addresses.tokens.depositToken
    )
  )

  const { swapFee, isSwapFeeFetching, getSwappedDepositAmount } = swapHooks.useFee({
    swapTokens,
    skip: !isSwapAvailable,
  })

  const fetchQuote = swapHooks.useQuote({ swapTokens })

  const field = useStakeField({
    swapFee,
    swapTokens,
    getSwappedDepositAmount,
  })

  const { swap, cancelSwap } = swapHooks.useActions({ fetchQuote })

  const { submit, transactionPrice, isSubmitting, isAllowanceFetching } = useStakeSubmit({
    swapTokens,
    field,
    swap,
    cancelSwap,
    fetchAllUserData,
  })

  const isStakeDisabled = useStakeDisabled({ field })
  const maxStakeAmount = swapHooks.useMaxAmount({
    token: swapTokens.sellToken,
    transactionPrice,
  })

  const isStakeLoading = (
    isSubmitting
    || isSwapFeeFetching
    || isBalancesFetching
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
  swapTokens: swapHooks.useTokens.mock,
  field: {} as Forms.Field<bigint>,
  fetchQuote: () => ({}) as any,
  submit: () => Promise.resolve(),
  getSwappedDepositAmount: () => 0n,
} as ReturnType<typeof useStake>


export default useStake
