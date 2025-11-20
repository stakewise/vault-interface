import { useMemo } from 'react'
import { useStore } from 'hooks'

import vaultHooks from '../../index'

import useUnstakeField from './useUnstakeField'
import useUnstakeSubmit from './useUnstakeSubmit'
import useUnstakeDisabled from './useUnstakeDisabled'
import useUnstakeTransactionPrice from './useUnstakeTransactionPrice'


type Input = {
  fetchAllUserData: ReturnType<typeof vaultHooks.useUser>['fetchAllUserData']
}

const storeSelector = (store: Store) => ({
  isBalancesFetching: store.vault.user.balances.isFetching,
  maxWithdrawAssets: store.vault.user.balances.maxWithdrawAssets,
})

const useUnstake = (values: Input) => {
  const { fetchAllUserData } = values

  const { maxWithdrawAssets, isBalancesFetching } = useStore(storeSelector)

  const field = useUnstakeField(maxWithdrawAssets)
  const isUnstakeDisabled = useUnstakeDisabled(field)
  const transactionPrice = useUnstakeTransactionPrice()

  const { submit, isSubmitting } = useUnstakeSubmit({
    field,
    fetchAllUserData,
  })

  const isUnstakeLoading = isSubmitting || isBalancesFetching

  return useMemo(() => ({
    field,
    transactionPrice,
    isUnstakeLoading,
    isUnstakeDisabled,
    maxUnstakeAmount: maxWithdrawAssets,
    submit,
  }), [
    field,
    transactionPrice,
    isUnstakeLoading,
    isUnstakeDisabled,
    maxWithdrawAssets,
    submit,
  ])
}

useUnstake.mock = {
  transactionPrice: 0n,
  isUnstakeLoading: false,
  isUnstakeDisabled: false,
  field: {} as Forms.Field<bigint>,
  submit: () => {},
} as ReturnType<typeof useUnstake>


export default useUnstake
